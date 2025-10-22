export const ROUTER_KEYS = {
	ROOT: '/',
	LOG_IN: 'log-in',
	SIGN_UP: 'sign-up',
	RESET_PASSWORD: 'reset-password',

	CREATE: 'create',
	EDIT: 'edit',

	PROFILE: 'profile',
	FINISH: 'finish',
	DYNAMIC_UID: ':uid',

	POSTS: 'posts',
} as const;

export const ROUTES = {
	ROOT: '/',
	LOG_IN: `/${ROUTER_KEYS.LOG_IN}`,
	SIGN_UP: `/${ROUTER_KEYS.SIGN_UP}`,
	SIGN_UP_FINISH: `/${ROUTER_KEYS.SIGN_UP}/${ROUTER_KEYS.FINISH}`,
	RESET_PASSWORD: `/${ROUTER_KEYS.RESET_PASSWORD}`,

	MY_PROFILE: `/${ROUTER_KEYS.PROFILE}`,
	PROFILE_EDIT: `/${ROUTER_KEYS.PROFILE}/${ROUTER_KEYS.EDIT}`,
	VIEW_PROFILE: (uid: string) => `/${ROUTER_KEYS.PROFILE}/${uid}`,

	POSTS_CREATE: `/${ROUTER_KEYS.POSTS}/${ROUTER_KEYS.CREATE}`,
} as const;

export const ROUTES_LABELS = {
	[ROUTES.ROOT]: 'Home',
	[ROUTES.MY_PROFILE]: 'My Profile',
	[ROUTES.POSTS_CREATE]: 'New Post',
} as const;
