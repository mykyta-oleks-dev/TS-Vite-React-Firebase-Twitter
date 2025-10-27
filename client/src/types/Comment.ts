import type { APIObject, AppObject } from './common';

interface CommentPrimitives {
	id: string;
	text: string;
	userId: string;
	userName: string;
	userAvatar: string | null;
	postId: string;
	responseTo?: string | null;
	isDeleted?: boolean;
}

export interface CommentApi extends CommentPrimitives, APIObject {}

export interface Comment extends CommentPrimitives, AppObject {}

export const parseFetchComment = (commentData: CommentApi): Comment => ({
	...commentData,

	createdAt: new Date(commentData.createdAt),
	updatedAt: new Date(commentData.updatedAt),
});
