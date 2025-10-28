export const urlRegex =
	/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=,]*)$/;

export const SHARED_VALIDATION_ERRORS = {
	PAGE: {
		INVALID: 'Page is not a valid number',
	},
	LIMIT: {
		INVALID: 'Limit is not a valid number',
	},
};

export const SHARED_REQ_ERRORS = {
	BADREQUEST_QUERY: 'Provided paginating query is invalid',
	
	UNAUTH: 'You have to be authenticated to perform this action',
} as const;
