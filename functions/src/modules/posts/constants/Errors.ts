import { LikeAction } from "../../../shared/types/data/Like";

export const TITLE_MIN_LENGTH = 3;

export const REQUEST_ERRORS = {
	BADREQUEST_WRITE: 'Post information is invalid',
	BADREQUEST_NOID: 'Post by specified ID is not found',
	BADREQUEST_DUPACTION: (action: LikeAction) => `You have already ${action}d the post`,
	BADREQUEST_LIKETYPE: 'Like action type is not specified (has to be "like" or "dislike")',

	NOTFOUND_ONE: 'Post document is not found',
	NOTFOUND_MANY: 'Post documents are not found',
	NOTFOUND_LIKE: "You haven't liked or disliked post yet",
} as const;

export const VALIDATION_ERRORS = {
	TITLE: {
		REQUIRED: 'Post title is required',
		INVALID: `Post title has to be at least ${TITLE_MIN_LENGTH} characters long`,
	},
	CONTENT: {
		REQUIRED: 'Post content is required',
	},
	PHOTO: {
		INVALID: 'Photo attribute has to be a valid URL',
	},
} as const;
