import { Router } from 'express';
import { ROUTES } from './constants/Routes';
import forceAuthenticate, { optionalAuthenticate } from '../../middlewares/Authentication';
import isVerified from '../../middlewares/VerificationCheck';
import postsController from './posts.controller';
import isAuthor from '../../middlewares/Authorization';
import { COLLECTIONS } from '../../shared/constants/Collections';

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
	isAuthor(COLLECTIONS.POSTS, 'id'),
	postsController.update
);
postsRoutes.delete(
	ROUTES.DYNAMIC,
	forceAuthenticate,
	isAuthor(COLLECTIONS.POSTS, 'id'),
	postsController.delete
);

// Likes submodule
postsRoutes.put(ROUTES.LIKE, forceAuthenticate, postsController.like);
postsRoutes.delete(ROUTES.LIKE, forceAuthenticate, postsController.removeLike);

export default postsRoutes;
