import { Router } from 'express';
import { Routes } from './constants/Routes';
import authenticate from '../../middlewares/Authentication';
import isVerified from '../../middlewares/VerificationCheck';
import postsController from './posts.controller';

const postsRoutes = Router();

postsRoutes.post(Routes.ROOT, authenticate, isVerified, postsController.create);

export default postsRoutes;
