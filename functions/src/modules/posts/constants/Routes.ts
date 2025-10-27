export const ROUTES = {
	ROOT: '/',
	DYNAMIC: '/:id',
	LIKE: '/:id/like',
	COMMENTS: '/:id/comments',
	COMMENT_SINGLE: '/:id/comments/:commentId'
} as const;
