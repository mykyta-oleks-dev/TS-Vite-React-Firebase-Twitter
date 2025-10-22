import { UserRecord } from 'firebase-admin/auth';
import { getAlgoliaClient, getIndex } from '../../config/algolia';
import { db } from '../../config/firebase';
import { NotFoundError } from '../../middlewares/ErrorHandling';
import { COLLECTIONS } from '../../shared/constants/Collections';
import { Post, postConverter } from '../../shared/types/data/Post';
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
			...values,
			id,
			createdAt: now,
			updatedAt: now,
			userId: user.uid,
			userName: user.displayName ?? user.email ?? user.uid,
		};

		await newPostRef.set(postData);

		const algoliaClient = getAlgoliaClient(true);
		const indexName = getIndex();

		try {
			const body: AlgoliaPost = {
				id: postData.id,
				title: postData.title,
				content: postData.content,
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

		return { post };
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

		postsQuery = postsQuery
			.limit(Math.max(limit, 1))
			.offset(Math.max(page - 1, 0) * limit);

		const postsSnapshot = await postsQuery.get();

		if (postsSnapshot.empty) {
			return { posts: [] };
		}

		const posts = postsSnapshot.docs.map((d) =>
			postConverter.fromFirestore(d)
		);

		return { posts };
	};

	private readonly _getManyWithSearch = async (
		search: string,
		page = 1,
		limit = 10,
		userId?: string,
	) => {
		const algoliaClient = getAlgoliaClient();
		const indexName = getIndex();

		const results = await algoliaClient.searchSingleIndex<AlgoliaPost>({
			indexName,
			searchParams: {
				query: search,
				hitsPerPage: Math.max(limit, 1),
				page: Math.max(page - 1, 0),
			},
		});

		const { hits } = results;

		if (hits.length === 0) {
			return { posts: [] };
		}

		const postIds = hits.map((hit) => hit.id);

		let postsQuery = db
			.collection(COLLECTIONS.POSTS)
			.orderBy('createdAt', 'desc')
		
		if (userId) {
			postsQuery = postsQuery.where('userId', '==', userId);
		}

		postsQuery = postsQuery.where('id', 'in', postIds);

		const snapshot = await postsQuery.get();
		const posts = snapshot.docs.map((d) => postConverter.fromFirestore(d));

		return { posts };
	};

	getMany = async (
		page = 1,
		limit = 10,
		userId?: string,
		search?: string
	) => {
		if (!search) return this._getMany(page, limit, userId);
		return this._getManyWithSearch(search, page, limit, userId);
	};
}

const postsRepository = new PostsRepository();

export default postsRepository;
