import {
	DocumentData,
	FirestoreDataConverter,
	Timestamp
} from 'firebase-admin/firestore';
import type { AppObject, DBObject } from './common.js';

export interface UserData {
	email: string;
	firstName: string;
	lastName: string;
	about: string | null;
	avatar: string;
	location: string | null;
}

export interface UserDB extends UserData, DBObject {
	birthday: Timestamp;
}

export interface User extends UserData, AppObject {
	birthday: Date;
}

export const userConverter: FirestoreDataConverter<User> = {
	toFirestore(user): DocumentData {
		return {
			...user,
		};
	},

	fromFirestore(snapshot) {
		const data = snapshot.data() as UserDB;
		return {
			...data,
			birthday: data.birthday.toDate(),
			createdAt: data.createdAt.toDate(),
			updatedAt: data.updatedAt.toDate(),
		};
	},
};
