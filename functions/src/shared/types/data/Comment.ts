import { DocumentData, FirestoreDataConverter } from 'firebase-admin/firestore';
import { AppObject, DBObject } from './common.js';

export interface CommentData {
	text: string;
	userId: string;
	postId: string;
	responseTo?: string | null;
	isDeleted?: boolean;
}

export interface CommentDB extends CommentData, DBObject {}

export interface Comment extends CommentData, AppObject {}

export interface CommentApiResponse extends Comment {
	userName: string;
	userAvatar: string | null;
}

export const commentConverter: FirestoreDataConverter<Comment> = {
	toFirestore(comment): DocumentData {
		return {
			...comment,
		};
	},

	fromFirestore(snapshot) {
		const data = snapshot.data() as CommentDB;
		return {
			...data,
			createdAt: data.createdAt.toDate(),
			updatedAt: data.updatedAt.toDate(),
		};
	},
};
