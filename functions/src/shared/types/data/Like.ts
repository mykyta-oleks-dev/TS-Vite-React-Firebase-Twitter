import { Timestamp } from 'firebase-admin/firestore';

export const likeActions = ['like', 'dislike'] as const;

export type LikeAction = (typeof likeActions)[number];

export interface LikeData {
	type: LikeAction;
}

export interface LikeDB extends LikeData {
	timestamp: Timestamp;
}

export interface Like extends LikeData {
	timestamp: Date;
	userId: string;
	postId: string;
}
