export const API_ENDPOINTS = {
	USERS: {
		SIGN_UP: '/users/sign-up'
	}
} as const;

export const HTTP = {
	OK: 200,
	CREATED: 201,
	NO_CONTENT: 204,
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	CONFLICT: 409,
	INTERNAL: 500,
} as const;
