import { DecodedIdToken, UserRecord } from 'firebase-admin/auth';
import { DocumentReference, FieldValue } from 'firebase-admin/firestore';
import { getAlgoliaClient, getIndex } from '../../config/algolia';
import { auth, db } from '../../config/firebase';
import {
	AppError,
	ConflictError,
	NotFoundError,
} from '../../middlewares/ErrorHandling';
import { COLLECTIONS_KEYS } from '../../shared/constants/Collections';
import {
	Comment,
	commentConverter,
	CommentApiResponse,
} from '../../shared/types/data/Comment';
import { Like, LikeAction, LikeDB } from '../../shared/types/data/Like';
import {
	Post,
	postConverter,
	PostData,
	PostApiResponse,
} from '../../shared/types/data/Post';
import { REQUEST_ERRORS } from './constants/Errors';
import { AlgoliaPost } from './types/algolia';
import { CommentInfo } from './types/commentBody';
import { PostInfo, PostQuery } from './types/postBody';

// For each time period (hour) passed score will decrease by...
const WEIGHT_FACTOR = 1;

class PostsRepository {
	create = async (user: UserRecord, values: PostInfo) => {
		const newPostRef = db.collection(COLLECTIONS_KEYS.POSTS).doc();
		const id = newPostRef.id;

		const now = new Date();

		const postData: Post = {
			id,
			content: values.content,
			title: values.title,
			photo: values.photo ?? null,

			createdAt: now,
			updatedAt: now,
			userId: user.uid,
			compositeScore: 0,
		};

		await newPostRef.set(postData);

		const algoliaClient = getAlgoliaClient(true);
		const indexName = getIndex();

		try {
			const body: AlgoliaPost = {
				id: postData.id,
				title: postData.title,
				content: postData.content,
				userId: user.uid,
			};

			await algoliaClient.saveObject({
				indexName,
				body,
			});
		} catch (err) {
			newPostRef.delete();
			throw err;
		}

		return { id };
	};

	getOne = async (
		id: string,
		requestUser?: DecodedIdToken,
		withComments?: boolean
	) => {
		const docSnapshot = await this._getPostSnapshot(id);

		const post = postConverter.fromFirestore(docSnapshot);

		let user: UserRecord | undefined;

		try {
			user = await auth.getUser(post.userId);
		} catch {
			user = undefined;
		}

		const postResponse: PostApiResponse = {
			...post,
			userName: user
				? user.displayName ?? user.email ?? user.uid
				: '[deleted]',
			userAvatar: user?.photoURL ?? null,
		};

		const userLikes = requestUser
			? await this._getLikes(requestUser.uid, [id])
			: undefined;

		const userLike =
			userLikes && userLikes.length > 0 ? userLikes[0] : undefined;

		const comments = withComments
			? await this._getCommentApiResponses(docSnapshot.ref)
			: undefined;

		return { post: postResponse, userLike, comments };
	};

	getMany = async (
		page = 1,
		limit = 10,
		requestUser?: DecodedIdToken,
		userId?: string,
		search?: string,
		sort?: PostQuery['sort']
	) => {
		const results = search
			? await this._getManyWithSearch(search, page, limit, userId, sort)
			: await this._getMany(page, limit, userId, sort);

		const postsPromises = results.posts.map(async (p) => {
			const user = await auth.getUser(p.userId);

			const postResponse: PostApiResponse = {
				...p,
				userName: user.displayName ?? user.email ?? user.uid,
				userAvatar: user.photoURL ?? null,
			};

			return postResponse;
		});

		const posts = await Promise.all(postsPromises);
		const postIds = posts.map((p) => p.id);

		const userLikes = requestUser
			? await this._getLikes(requestUser.uid, postIds)
			: undefined;

		return {
			...results,
			posts,
			userLikes,
		};
	};

	update = async (id: string, values: PostInfo) => {
		const postSnapshot = await this._getPostSnapshot(id);
		const postRef = postSnapshot.ref;

		const postData = postConverter.fromFirestore(postSnapshot);

		const photo =
			values.photo === undefined ? postData.photo : values.photo;

		const postInfo: Pick<PostData, 'title' | 'content' | 'photo'> = {
			content: values.content,
			title: values.title,
			photo,
		};

		await postRef.update({
			...postInfo,
			updatedAt: new Date(),
		});

		try {
			const algoliaClient = getAlgoliaClient(true);
			const indexName = getIndex();

			const { hits } = await algoliaClient.searchSingleIndex<AlgoliaPost>(
				{
					indexName,
					searchParams: {
						filters: `id:${postRef.id}`,
					},
				}
			);

			if (hits.length === 0) {
				const body: AlgoliaPost = {
					id: postRef.id,
					title: postInfo.title,
					content: postInfo.content,
					userId: postData.userId,
				};

				await algoliaClient.saveObject({
					indexName,
					body,
				});
			} else {
				const hit = hits[0];

				await algoliaClient.partialUpdateObject({
					indexName,
					objectID: hit.objectID,
					attributesToUpdate: {
						title: postInfo.title,
						content: postInfo.content,
					},
				});
			}
		} catch (err) {
			await postRef.set(postData);
			throw err;
		}

		return { id: postRef.id };
	};

	delete = async (id: string) => {
		const postSnapshot = await this._getPostSnapshot(id);
		const postRef = postSnapshot.ref;

		const algoliaClient = getAlgoliaClient(true);
		const indexName = getIndex();

		const { hits } = await algoliaClient.searchSingleIndex<AlgoliaPost>({
			indexName,
			searchParams: {
				filters: `id:${postRef.id}`,
			},
		});

		if (hits.length === 1) {
			const hit = hits[0];

			await algoliaClient.deleteObject({
				indexName,
				objectID: hit.objectID,
			});
		} else if (hits.length > 1) {
			throw new AppError(
				'Multiple objects found with same ID, contact developers to address the issue'
			);
		}

		await db.recursiveDelete(postRef);
	};

	// Likes and score write

	like = async (user: DecodedIdToken, postId: string, type: LikeAction) => {
		const postRef = db.collection(COLLECTIONS_KEYS.POSTS).doc(postId);

		const likeRef = postRef
			.collection(COLLECTIONS_KEYS.LIKES)
			.doc(user.uid);

		await db.runTransaction(async (t) => {
			const postSnap = await t.get(postRef.withConverter(postConverter));
			const post = postSnap.data();

			if (!postSnap.exists || !post) {
				throw new NotFoundError(REQUEST_ERRORS.NOT_FOUND_POST);
			}

			const likeSnap = await t.get(likeRef);

			const oldLikeType: LikeAction | undefined = likeSnap.exists
				? (likeSnap.data() as LikeDB).type
				: undefined;

			if (oldLikeType === type) {
				throw new ConflictError(
					REQUEST_ERRORS.CONFLICT_DUP_ACTION(type)
				);
			}

			const updates: { [key: string]: FieldValue | number } = {};

			let likesChange = 0;
			let dislikesChange = 0;

			if (oldLikeType === 'like') {
				likesChange--;
			} else if (oldLikeType === 'dislike') {
				dislikesChange--;
			}

			if (type === 'like') {
				likesChange++;
			} else {
				dislikesChange++;
			}

			if (likesChange !== 0) {
				updates.likes = FieldValue.increment(likesChange);
			}
			if (dislikesChange !== 0) {
				updates.dislikes = FieldValue.increment(dislikesChange);
			}

			const newPost: Post = {
				...post,
				likes: (post.likes || 0) + likesChange,
				dislikes: (post.dislikes || 0) + dislikesChange,
			};

			const newScore = this._calculateScore(newPost);
			updates.compositeScore = newScore;

			t.update(postRef, updates);

			t.set(likeRef, {
				type,
				userId: user.uid,
				postId: postId,
				timestamp: FieldValue.serverTimestamp(),
			});
		});
	};

	removeLike = async (user: DecodedIdToken, postId: string) => {
		const postRef = db.collection(COLLECTIONS_KEYS.POSTS).doc(postId);

		const likeRef = postRef
			.collection(COLLECTIONS_KEYS.LIKES)
			.doc(user.uid);

		await db.runTransaction(async (t) => {
			const postSnap = await t.get(postRef.withConverter(postConverter));
			const post = postSnap.data();

			if (!postSnap.exists || !post) {
				throw new NotFoundError(REQUEST_ERRORS.NOT_FOUND_POST);
			}

			const likeSnap = await t.get(likeRef);

			const likeData = (likeSnap.data() as LikeDB) || undefined;

			if (!likeData) {
				throw new NotFoundError(REQUEST_ERRORS.NOT_FOUND_LIKE);
			}

			const updates: { [key: string]: FieldValue | number } = {};

			let likesChange = 0;
			let dislikesChange = 0;

			if (likeData.type === 'like') {
				likesChange--;
			} else {
				dislikesChange--;
			}

			if (likesChange !== 0) {
				updates.likes = FieldValue.increment(likesChange);
			}
			if (dislikesChange !== 0) {
				updates.dislikes = FieldValue.increment(dislikesChange);
			}

			const newPost: Post = {
				...post,
				likes: (post.likes || 0) + likesChange,
				dislikes: (post.dislikes || 0) + dislikesChange,
			};

			const newScore = this._calculateScore(newPost);
			updates.compositeScore = newScore;

			t.update(postRef, updates);

			t.delete(likeRef);
		});
	};

	// Comments write

	createComment = async (
		user: DecodedIdToken,
		postId: string,
		values: CommentInfo
	) => {
		const postRef = db.collection(COLLECTIONS_KEYS.POSTS).doc(postId);

		const commentRef = postRef.collection(COLLECTIONS_KEYS.COMMENTS).doc();

		const respondedTo =
			values.responseTo &&
			(await this._getComment(postRef, values.responseTo, true));

		if (respondedTo && respondedTo.comment.isDeleted) {
			throw new ConflictError(REQUEST_ERRORS.CONFLICT_ORIG_COMM_DELETED);
		}

		const id = await db.runTransaction(async (t) => {
			const postSnap = await t.get(postRef.withConverter(postConverter));
			const post = postSnap.data();

			if (!postSnap.exists || !post) {
				throw new NotFoundError(REQUEST_ERRORS.NOT_FOUND_POST);
			}

			const commentSnap = await t.get(commentRef);

			const id = commentSnap.id;

			const now = new Date();

			const newCommentData: Comment = {
				id,
				text: values.text,
				createdAt: now,
				updatedAt: now,
				postId,
				responseTo: values.responseTo ?? null,
				userId: user.uid,
			};

			t.set(commentRef, newCommentData);

			const updates: { [key: string]: FieldValue | number } = {};

			const newPost: Post = {
				...post,
				comments: (post.comments || 0) + 1,
			};

			const newScore = this._calculateScore(newPost);
			updates.compositeScore = newScore;
			updates.comments = FieldValue.increment(1);

			t.update(postRef, updates);

			return id;
		});

		const { comment } = await this._getComment(postRef, id);

		const userObj = await auth.getUser(user.uid);

		const commentApiResponse: CommentApiResponse = {
			...comment,

			userName: userObj.displayName ?? userObj.email ?? userObj.uid,
			userAvatar: userObj.photoURL ?? null,
		};

		return { comment: commentApiResponse };
	};

	updateComment = async (
		postId: string,
		commentId: string,
		values: CommentInfo
	) => {
		const docSnapshot = await this._getPostSnapshot(postId);

		const commentDoc = docSnapshot.ref
			.collection(COLLECTIONS_KEYS.COMMENTS)
			.doc(commentId);

		const commentData = (await commentDoc.get()).data();

		if (!commentData) {
			throw new NotFoundError(REQUEST_ERRORS.NOT_FOUND_COMMENT);
		}

		const now = new Date();

		await commentDoc.update({
			text: values.text,
			updatedAt: now,
		});

		const { comment } = await this._getComment(docSnapshot.ref, commentId);

		return { comment };
	};

	deleteComment = async (postId: string, commentId: string) => {
		const postRef = db.collection(COLLECTIONS_KEYS.POSTS).doc(postId);

		const { commentRef, comment } = await this._getComment(
			postRef,
			commentId
		);

		await db.runTransaction(async (t) => {
			const postSnap = await t.get(postRef.withConverter(postConverter));
			const post = postSnap.data();

			if (!postSnap.exists || !post) {
				throw new NotFoundError(REQUEST_ERRORS.NOT_FOUND_POST);
			}

			const now = new Date();

			const newCommentData: Comment = {
				...comment,
				updatedAt: now,
				isDeleted: true,
				text: '[deleted]',
			};

			t.set(commentRef, newCommentData);

			const updates: { [key: string]: FieldValue | number } = {};

			const newPost: Post = {
				...post,
				comments: (post.comments || 0) - 1,
			};

			const newScore = this._calculateScore(newPost);
			updates.compositeScore = newScore;
			updates.comments = FieldValue.increment(-1);

			t.update(postRef, updates);
		});
	};

	// Private helper methods

	private readonly _getPostSnapshot = async (id: string) => {
		const postsSnapshot = await db
			.collection(COLLECTIONS_KEYS.POSTS)
			.where('id', '==', id)
			.limit(1)
			.get();

		if (postsSnapshot.empty) {
			throw new NotFoundError(REQUEST_ERRORS.NOT_FOUND_POST);
		}

		return postsSnapshot.docs[0];
	};

	private readonly _getManyWithSearch = async (
		search: string,
		page = 1,
		limit = 10,
		userId?: string,
		sort?: PostQuery['sort']
	) => {
		const algoliaClient = getAlgoliaClient();
		const indexName = getIndex();

		const results = await algoliaClient.searchSingleIndex<AlgoliaPost>({
			indexName,
			searchParams: {
				query: search,
				hitsPerPage: Math.max(limit, 1),
				page: Math.max(page - 1, 0),
				filters: userId ? `userId:${userId}` : undefined,
			},
		});

		const { hits } = results;

		const postIds = hits.map((hit) => hit.id);

		if (!postIds.length) {
			return {
				posts: [],
				total: results.nbHits ?? 0,
				pages: results.nbPages ?? 0,
			};
		}

		const postsRef = db.collection(COLLECTIONS_KEYS.POSTS);

		let postsQuery =
			sort === 'hot'
				? postsRef.orderBy('compositeScore', 'desc')
				: postsRef.orderBy('createdAt', 'desc');

		postsQuery = postsQuery.where('id', 'in', postIds);

		const snapshot = await postsQuery.get();
		const posts = snapshot.docs.map((d) => postConverter.fromFirestore(d));

		return {
			posts,
			total: results.nbHits ?? 0,
			pages: results.nbPages ?? 0,
		};
	};

	private readonly _getMany = async (
		page = 1,
		limit = 10,
		userId?: string,
		sort?: PostQuery['sort']
	) => {
		const postsRef = db.collection(COLLECTIONS_KEYS.POSTS);
		let postsQuery =
			sort === 'hot'
				? postsRef.orderBy('compositeScore', 'desc')
				: postsRef.orderBy('createdAt', 'desc');

		if (userId) {
			postsQuery = postsQuery.where('userId', '==', userId);
		}

		const finalPostsQuery = postsQuery
			.limit(Math.max(limit, 1))
			.offset(Math.max(page - 1, 0) * limit);

		const postsSnapshot = await finalPostsQuery.get();

		const total = (await postsQuery.count().get()).data().count;

		const pages = Math.ceil(total / limit);

		const posts = postsSnapshot.docs.map((d) =>
			postConverter.fromFirestore(d)
		);

		return { posts, total, pages };
	};

	private readonly _getLikes = async (uid: string, postIds: string[]) => {
		return (
			await db
				.collectionGroup('likes')
				.where('userId', '==', uid)
				.where('postId', 'in', postIds)
				.get()
		).docs.map((d) => {
			const docData = d.data() as LikeDB;
			return {
				...docData,
				timestamp: docData.timestamp.toDate(),
			} as Like;
		});
	};

	private _calculateScore(post: Post) {
		const netLikes = (post.likes || 0) - (post.dislikes || 0);
		const comments = (post.comments || 0) * 3;
		const ageInMs = Date.now() - post.createdAt.getTime();
		const ageInHours = ageInMs / (1000 * 60 * 60);

		return netLikes + comments - ageInHours * WEIGHT_FACTOR;
	}

	private readonly _getComment = async (
		postRef: DocumentReference,
		id: string,
		isResponse = false
	) => {
		const commentRef = postRef
			.collection(COLLECTIONS_KEYS.COMMENTS)
			.doc(id);
		const comment = (
			await commentRef.withConverter(commentConverter).get()
		).data();

		if (!comment)
			throw new NotFoundError(
				isResponse
					? REQUEST_ERRORS.NOT_FOUND_COMMENT_RESPONDED
					: REQUEST_ERRORS.NOT_FOUND_COMMENT
			);

		return { comment, commentRef };
	};

	private readonly _getComments = async (postRef: DocumentReference) =>
		(
			await postRef
				.collection(COLLECTIONS_KEYS.COMMENTS)
				.withConverter(commentConverter)
				.orderBy('createdAt', 'desc')
				.get()
		).docs.map((p) => p.data());

	private readonly _getCommentApiResponses = async (
		postRef: DocumentReference
	) => {
		return await Promise.all(
			(
				await this._getComments(postRef)
			).map(async (c) => {
				let user: UserRecord | undefined;
				try {
					user = await auth.getUser(c.userId);
				} catch {
					user = undefined;
				}

				const commentResponse: CommentApiResponse = {
					...c,

					userId: user && !c.isDeleted ? c.userId : '[deleted]',
					userName:
						user && !c.isDeleted
							? user.displayName ?? user.email ?? user.uid
							: '[deleted]',
					userAvatar:
						user && !c.isDeleted && user.photoURL
							? user.photoURL
							: null,
				};

				return commentResponse;
			})
		);
	};
}

const postsRepository = new PostsRepository();

export default postsRepository;
