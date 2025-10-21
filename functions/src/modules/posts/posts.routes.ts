import { Router } from 'express';
import { ROUTES } from './constants/Routes';
import authenticate from '../../middlewares/Authentication';
import isVerified from '../../middlewares/VerificationCheck';
import postsController from './posts.controller';

const postsRoutes = Router();

postsRoutes.post(ROUTES.ROOT, authenticate, isVerified, postsController.create);
postsRoutes.get(ROUTES.DYNAMIC, postsController.getOne);
postsRoutes.get(ROUTES.ROOT, postsController.getMany);

export default postsRoutes;
