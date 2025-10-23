import { UserRecord } from 'firebase-admin/auth';
import { getAlgoliaClient, getIndex } from '../../config/algolia';
import { auth, db } from '../../config/firebase';
import { AppError, NotFoundError } from '../../middlewares/ErrorHandling';
import { COLLECTIONS } from '../../shared/constants/Collections';
import {
	Post,
	postConverter,
	PostData,
	PostResponse,
} from '../../shared/types/data/Post';
import { REQUEST_ERRORS } from './constants/Errors';
import { AlgoliaPost } from './types/algolia';
import { PostInfo } from './types/body';

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

	getOne = async (id: string) => {
		const docSnapshot = await PostsRepository._getPostSnapshot(id);

		const post = postConverter.fromFirestore(docSnapshot);

		const user = await auth.getUser(post.userId);

		const postResponse: PostResponse = {
			...post,
			userName: user.displayName ?? user.email ?? user.uid,
			userAvatar: user.photoURL ?? null,
		};

		return { post: postResponse };
	};

	private readonly _getMany = async (
		page = 1,
		limit = 10,
		userId?: string
	) => {
		let postsQuery = db
			.collection(COLLECTIONS.POSTS)
			.orderBy('createdAt', 'desc');

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
		userId?: string
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

		let postsQuery = db
			.collection(COLLECTIONS.POSTS)
			.orderBy('createdAt', 'desc')
			.where('id', 'in', postIds);

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
		userId?: string,
		search?: string
	) => {
		const results = search
			? await this._getManyWithSearch(search, page, limit, userId)
			: await this._getMany(page, limit, userId);

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

		return {
			...results,
			posts,
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
}

const postsRepository = new PostsRepository();

export default postsRepository;
