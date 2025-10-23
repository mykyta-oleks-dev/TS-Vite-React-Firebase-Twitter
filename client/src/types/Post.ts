import type { APIObject, AppObject } from './common';

interface PostPrimitives {
	id: string;
	title: string;
	content: string;
	photo?: string | null;

	userId: string;
	userName: string;
	userAvatar?: string;

	likes?: number;
	dislikes?: number;
	compositeScore: number;
}

export interface PostApi extends PostPrimitives, APIObject {}

export interface Post extends PostPrimitives, AppObject {}

export const parseFetchPost = (postData: PostApi): Post => ({
	...postData,

	createdAt: new Date(postData.createdAt),
	updatedAt: new Date(postData.updatedAt),
});
