export const TITLE_MIN_LENGTH = 3;

export const REQUEST_ERRORS = {
	BADREQUEST_CREATE: 'Post information is invalid',
	BADREQUEST_NOID: 'Post by specified ID is not found',
	
	NOTFOUND_ONE: 'Post document is not found',
	NOTFOUND_MANY: 'Post documents are not found',
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
