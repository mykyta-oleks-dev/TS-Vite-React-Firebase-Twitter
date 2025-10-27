import { Router } from 'express';
import { ROUTES } from './constants/Routes';
import forceAuthenticate, {
	optionalAuthenticate,
} from '../../middlewares/Authentication';
import isVerified from '../../middlewares/VerificationCheck';
import postsController from './posts.controller';
import isAuthor from '../../middlewares/Authorization';
import { COLLECTIONS_KEYS } from '../../shared/constants/Collections';

const postsRoutes = Router();

postsRoutes.post(
	ROUTES.ROOT,
	forceAuthenticate,
	isVerified,
	postsController.create
);
postsRoutes.get(ROUTES.DYNAMIC, optionalAuthenticate, postsController.getOne);
postsRoutes.get(ROUTES.ROOT, optionalAuthenticate, postsController.getMany);
postsRoutes.put(
	ROUTES.DYNAMIC,
	forceAuthenticate,
	isAuthor([COLLECTIONS_KEYS.POSTS], ['id']),
	postsController.update
);
postsRoutes.delete(
	ROUTES.DYNAMIC,
	forceAuthenticate,
	isAuthor([COLLECTIONS_KEYS.POSTS], ['id']),
	postsController.delete
);

// Likes routes
postsRoutes.put(ROUTES.LIKE, forceAuthenticate, postsController.like);
postsRoutes.delete(ROUTES.LIKE, forceAuthenticate, postsController.removeLike);

// Comments routes
postsRoutes.post(
	ROUTES.COMMENTS,
	forceAuthenticate,
	postsController.createComment
);
postsRoutes.patch(
	ROUTES.COMMENT_SINGLE,
	forceAuthenticate,
	isAuthor([COLLECTIONS_KEYS.POSTS, COLLECTIONS_KEYS.COMMENTS], ['id', 'commentId']),
	postsController.updateComment
);

export default postsRoutes;
