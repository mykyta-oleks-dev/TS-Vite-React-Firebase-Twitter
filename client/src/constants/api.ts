const USERS = '/users';

export const API_ENDPOINTS = {
	USERS: {
		ROOT: USERS,
		SIGN_UP: `${USERS}/sign-up`,
		SIGN_UP_GOOGLE: `${USERS}/sign-up-google`,
		GET_ONE: (uid: string) => `${USERS}/${uid}`,
		RESEND_VERIFICATION: `${USERS}/resend-verification`,
		CHANGE_PASSWORD: `${USERS}/change-password`,
		RESET_PASSWORD: `${USERS}/reset-password`,
	},
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
