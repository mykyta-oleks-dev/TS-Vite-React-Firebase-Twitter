import { UserRecord } from 'firebase-functions/v1/auth';
import { db } from '../../config/firebase';
import { COLLECTIONS } from '../../shared/constants/Collections';
import { Post } from '../../shared/types/data/Post';
import { PostInfo } from './types/body';

class PostsRepository {
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
}

const postsRepository = new PostsRepository();

export default postsRepository;
