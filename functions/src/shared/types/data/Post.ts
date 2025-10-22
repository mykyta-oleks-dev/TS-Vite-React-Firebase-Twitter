import { DocumentData, FirestoreDataConverter } from "firebase-admin/firestore";
import { AppObject, DBObject } from "./common";

export interface PostData {
	title: string;
	content: string;
	photo?: string;

	userId: string;
	userName: string;
	userAvatar: string | null;
}

export interface PostDB extends PostData, DBObject {};

export interface Post extends PostData, AppObject {};

export const postConverter: FirestoreDataConverter<Post> = {
	toFirestore(post): DocumentData {
		return {
			...post,
		};
	},

	fromFirestore(snapshot) {
		const data = snapshot.data() as PostDB;
		return {
			...data,
			createdAt: data.createdAt.toDate(),
			updatedAt: data.updatedAt.toDate(),
		};
	},
};
