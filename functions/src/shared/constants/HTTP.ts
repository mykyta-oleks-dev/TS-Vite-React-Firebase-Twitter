export const HTTP = {
	OK: 200,
	CREATED: 201,
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	CONFLICT: 409,
	INTERNAL: 500,
} as const;

export const HTTP_LABEL = {
	[HTTP.OK]: 'Success!',
	[HTTP.CREATED]: 'Resource successfuly created!',
	[HTTP.BAD_REQUEST]: 'Bad Request',
	[HTTP.UNAUTHORIZED]: 'Unauthorized',
	[HTTP.FORBIDDEN]: 'Forbidden',
	[HTTP.NOT_FOUND]: 'Not Found',
	[HTTP.CONFLICT]: 'Conflict',
	[HTTP.INTERNAL]: 'Internal Server Error',
} as const;
