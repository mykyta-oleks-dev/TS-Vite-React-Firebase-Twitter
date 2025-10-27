import { LikeAction } from '../../../shared/types/data/Like';

export const TITLE_MIN_LENGTH = 3;

export const REQUEST_ERRORS = {
	BAD_REQUEST_POST_WRITE: 'Post information is invalid',
	BAD_REQUEST_COMMENT_WRITE: 'Comment information is invalid',
	BAD_REQUEST_NO_POST_ID: 'Post ID is not provided',
	BAD_REQUEST_NO_COMM_ID: 'Comment ID is not provided',
	BAD_REQUEST_LIKE_TYPE:
		'Like action type is not specified (has to be "like" or "dislike")',

		
	CONFLICT_DUP_ACTION: (action: LikeAction) =>
		`You have already ${action}d the post`,
	CONFLICT_ORIG_COMM_DELETED: "You can't answer to the deleted comment",

	NOT_FOUND_POST: 'Post document is not found',
	NOT_FOUND_MANY: 'Post documents are not found',
	NOT_FOUND_LIKE: "You haven't liked or disliked post yet",
	NOT_FOUND_COMMENT: 'Comment document is not found',
	NOT_FOUND_COMMENT_RESPONDED: 'Comment document responded to is not found',
} as const;

export const POST_VALIDATION_ERRORS = {
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

export const COMMENT_VALIDATION_ERRORS = {
	TEXT: {
		REQUIRED: 'Comment text is required!',
	},
};
