import { Timestamp } from 'firebase-admin/firestore';

export interface DBObject {
	createdAt: Timestamp;
	updatedAt: Timestamp;
	id: string;
}

export interface AppObject {
	createdAt: Date;
	updatedAt: Date;
	id: string;
}

export type Stringified<T> = {
	[key in keyof T]: string
}
