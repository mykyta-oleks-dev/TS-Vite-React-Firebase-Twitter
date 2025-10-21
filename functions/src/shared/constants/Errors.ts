export const urlRegex =
	/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=,]*)$/;

export const SHARED_REQ_ERRORS = {
	UNAUTH: 'You have to be authenticated to perform this action',
} as const;
