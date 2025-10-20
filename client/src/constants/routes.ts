export const ROUTER_KEYS = {
	ROOT: '/',
	LOG_IN: 'log-in',
	SIGN_UP: 'sign-up',
	EDIT: 'edit',

	PROFILE: 'profile',
	FINISH: 'finish',
} as const;

export const ROUTES = {
	ROOT: '/',
	LOG_IN: `/${ROUTER_KEYS.LOG_IN}`,
	SIGN_UP: `/${ROUTER_KEYS.SIGN_UP}`,
	SIGN_UP_FINISH: `/${ROUTER_KEYS.SIGN_UP}/${ROUTER_KEYS.FINISH}`,

	PROFILE: `/${ROUTER_KEYS.PROFILE}`,
	PROFILE_EDIT: `/${ROUTER_KEYS.PROFILE}/${ROUTER_KEYS.EDIT}`,
};

export const ROUTES_LABELS = {
	[ROUTES.ROOT]: 'Home',
	[ROUTES.PROFILE]: 'My Profile',
};
