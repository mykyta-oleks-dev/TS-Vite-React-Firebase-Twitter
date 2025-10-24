import { DecodedIdToken, UserRecord } from 'firebase-admin/auth';
import { FieldValue } from 'firebase-admin/firestore';
import { getAlgoliaClient, getIndex } from '../../config/algolia';
import { auth, db } from '../../config/firebase';
import {
	AppError,
	BadRequestError,
	NotFoundError,
} from '../../middlewares/ErrorHandling';
import { COLLECTIONS } from '../../shared/constants/Collections';
import { Like, LikeAction, LikeDB } from '../../shared/types/data/Like';
import {
	Post,
	postConverter,
	PostData,
	PostResponse,
} from '../../shared/types/data/Post';
import { REQUEST_ERRORS } from './constants/Errors';
import { AlgoliaPost } from './types/algolia';
import { PostInfo, PostQuery } from './types/body';

// For each time period (hour) passed score will decrease by...
const WEIGHT_FACTOR = 1;

class PostsRepository {
	private static readonly _getPostSnapshot = async (id: string) => {
		const postsSnapshot = await db
			.collection(COLLECTIONS.POSTS)
			.where('id', '==', id)
			.limit(1)
			.get();

		if (postsSnapshot.empty) {
			throw new NotFoundError(REQUEST_ERRORS.NOTFOUND_ONE);
		}

		return postsSnapshot.docs[0];
	};

	create = async (user: UserRecord, values: PostInfo) => {
		const newPostRef = db.collection(COLLECTIONS.POSTS).doc();
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

	getOne = async (id: string, requestUser?: DecodedIdToken) => {
		const docSnapshot = await PostsRepository._getPostSnapshot(id);

		const post = postConverter.fromFirestore(docSnapshot);

		const user = await auth.getUser(post.userId);

		const postResponse: PostResponse = {
			...post,
			userName: user.displayName ?? user.email ?? user.uid,
			userAvatar: user.photoURL ?? null,
		};

		const userLikes = requestUser
			? await this._getLikes(requestUser.uid, [id])
			: undefined;
		
		const userLike = userLikes && userLikes.length > 0 ? userLikes[0] : undefined;

		return { post: postResponse, userLike };
	};

	private readonly _getMany = async (
		page = 1,
		limit = 10,
		userId?: string,
		sort?: PostQuery['sort']
	) => {
		const postsRef = db.collection(COLLECTIONS.POSTS);
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

		const postsRef = db.collection(COLLECTIONS.POSTS);

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

			const postResponse: PostResponse = {
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
		const postSnapshot = await PostsRepository._getPostSnapshot(id);
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
		const postSnapshot = await PostsRepository._getPostSnapshot(id);
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

		await postRef.delete();
	};

	private _calculateScore(post: Post) {
		const netLikes = (post.likes || 0) - (post.dislikes || 0);
		const ageInMs = Date.now() - post.createdAt.getTime();
		const ageInHours = ageInMs / (1000 * 60 * 60);

		return netLikes - ageInHours * WEIGHT_FACTOR;
	}

	like = async (user: DecodedIdToken, postId: string, type: LikeAction) => {
		const postRef = db.collection(COLLECTIONS.POSTS).doc(postId);

		const likeRef = postRef.collection(COLLECTIONS.LIKES).doc(user.uid);

		await db.runTransaction(async (t) => {
			const postSnap = await t.get(postRef.withConverter(postConverter));
			const post = postSnap.data();

			if (!postSnap.exists || !post) {
				throw new NotFoundError(REQUEST_ERRORS.NOTFOUND_ONE);
			}

			const likeSnap = await t.get(likeRef);

			const oldLikeType: LikeAction | undefined = likeSnap.exists
				? (likeSnap.data() as LikeDB).type
				: undefined;

			if (oldLikeType === type) {
				throw new BadRequestError(
					REQUEST_ERRORS.BADREQUEST_DUPACTION(type)
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

	removeLike = async (user: DecodedIdToken, id: string) => {
		const postRef = db.collection(COLLECTIONS.POSTS).doc(id);

		const likeRef = postRef.collection(COLLECTIONS.LIKES).doc(user.uid);

		await db.runTransaction(async (t) => {
			const postSnap = await t.get(postRef.withConverter(postConverter));
			const post = postSnap.data();

			if (!postSnap.exists || !post) {
				throw new NotFoundError(REQUEST_ERRORS.NOTFOUND_ONE);
			}

			const likeSnap = await t.get(likeRef);

			const likeData = (likeSnap.data() as LikeDB) || undefined;

			if (!likeData) {
				throw new NotFoundError(REQUEST_ERRORS.NOTFOUND_LIKE);
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
}

const postsRepository = new PostsRepository();

export default postsRepository;
