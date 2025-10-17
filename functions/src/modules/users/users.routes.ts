import { Router } from 'express';
import authenticate from '../../middlewares/Authentication';
import usersController from './users.controller';

const usersRoutes = Router();

usersRoutes.post('/sign-up', usersController.signUp);
usersRoutes.get('/:uid', usersController.getOne)
usersRoutes.get('/', usersController.getMany)
usersRoutes.put('/', authenticate, usersController.update);
usersRoutes.delete('/', authenticate, usersController.delete);
usersRoutes.post(
	'/resend-verification',
	authenticate,
	usersController.resendVerification
);
usersRoutes.post(
	'/change-password',
	authenticate,
	usersController.changePassword
);
usersRoutes.post(
	'/reset-password',
	authenticate,
	usersController.resetPassword
);

export default usersRoutes;
