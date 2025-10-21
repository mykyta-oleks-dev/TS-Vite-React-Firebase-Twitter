import { UserRecord } from 'firebase-functions/v1/auth';
import { db } from '../../config/firebase';
import { NotFoundError } from '../../middlewares/ErrorHandling';
import { COLLECTIONS } from '../../shared/constants/Collections';
import { Post, postConverter } from '../../shared/types/data/Post';
import { REQUEST_ERRORS } from './constants/Errors';
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

		return { id };
	};

	getOne = async (id: string) => {
		const docSnapshot = await PostsRepository._getPostSnapshot(id);

		const post = postConverter.fromFirestore(docSnapshot);

		return { post };
	};

	getMany = async (page = 1, limit = 10, userId?: string) => {
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
			throw new NotFoundError(REQUEST_ERRORS.NOTFOUND_MANY);
		}

		const posts = postsSnapshot.docs.map((d) =>
			postConverter.fromFirestore(d)
		);

		return { posts };
	};
}

const postsRepository = new PostsRepository();

export default postsRepository;
