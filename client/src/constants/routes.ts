const ROOT = '/';
const LOG_IN = '/log-in';
const SIGN_UP = '/sign-up';

export const ROUTES = {
	ROOT,
	LOG_IN,
	SIGN_UP,
	SIGN_UP_GOOGLE_FINISH: `${SIGN_UP}/finish`,
} as const;
