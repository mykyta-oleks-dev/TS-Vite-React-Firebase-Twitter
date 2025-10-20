export const ROUTER_KEYS = {
	ROOT: '/',
	LOG_IN: 'log-in',
	SIGN_UP: 'sign-up',

	PROFILE: 'profile',
	FINISH: 'finish',
} as const;

export const ROUTES = {
	ROOT: '/',
	LOG_IN: `/${ROUTER_KEYS.LOG_IN}`,
	SIGN_UP: `/${ROUTER_KEYS.SIGN_UP}`,
	SIGN_UP_FINISH: `/${ROUTER_KEYS.SIGN_UP}/${ROUTER_KEYS.FINISH}`,
	PROFILE: `/${ROUTER_KEYS.PROFILE}`,
};

export const ROUTES_LABELS = {
	[ROUTES.ROOT]: 'Home',
	[ROUTES.PROFILE]: 'My Profile',
};
