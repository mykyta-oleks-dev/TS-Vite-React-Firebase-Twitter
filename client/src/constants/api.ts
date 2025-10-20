const USERS_ROUTES = '/users'

export const API_ENDPOINTS = {
	USERS: {
		SIGN_UP: `${USERS_ROUTES}/sign-up`,
		SIGN_UP_GOOGLE: `${USERS_ROUTES}/sign-up-google`,
		GET_ONE: (uid: string) => `${USERS_ROUTES}/${uid}`,
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
