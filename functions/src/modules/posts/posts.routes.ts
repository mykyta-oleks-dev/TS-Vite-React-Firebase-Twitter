import { Router } from 'express';
import { ROUTES } from './constants/Routes';
import authenticate from '../../middlewares/Authentication';
import isVerified from '../../middlewares/VerificationCheck';
import postsController from './posts.controller';
import isAuthor from '../../middlewares/Authorization';
import { COLLECTIONS } from '../../shared/constants/Collections';

const postsRoutes = Router();

postsRoutes.post(ROUTES.ROOT, authenticate, isVerified, postsController.create);
postsRoutes.get(ROUTES.DYNAMIC, postsController.getOne);
postsRoutes.get(ROUTES.ROOT, postsController.getMany);
postsRoutes.put(
	ROUTES.DYNAMIC,
	authenticate,
	isAuthor(COLLECTIONS.POSTS, 'id'),
	postsController.update
);
postsRoutes.delete(
	ROUTES.DYNAMIC,
	authenticate,
	isAuthor(COLLECTIONS.POSTS, 'id'),
	postsController.delete
);

// Likes submodule
postsRoutes.put(ROUTES.LIKE, authenticate, postsController.like);
postsRoutes.delete(ROUTES.LIKE, authenticate, postsController.removeLike);

export default postsRoutes;
