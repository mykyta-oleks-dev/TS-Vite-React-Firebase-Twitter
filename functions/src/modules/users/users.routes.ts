import { Router } from 'express';
import authenticate from '../../middlewares/Authentication';
import usersController from './users.controller';
import { ROUTES } from './constants/Routes';

const usersRoutes = Router();

usersRoutes.post(ROUTES.SIGN_UP, usersController.signUp);
usersRoutes.post(ROUTES.SIGN_UP_GOOGLE, authenticate, usersController.signUpGoogle);
usersRoutes.get(ROUTES.DYNAMIC, usersController.getOne)
usersRoutes.get(ROUTES.ROOT, usersController.getMany)
usersRoutes.put(ROUTES.ROOT, authenticate, usersController.update);
usersRoutes.delete(ROUTES.ROOT, authenticate, usersController.delete);
usersRoutes.post(
	ROUTES.RESEND_VERIFICATION,
	authenticate,
	usersController.resendVerification
);
usersRoutes.post(
	ROUTES.CHANGE_PASSWORD,
	authenticate,
	usersController.changePassword
);
usersRoutes.post(
	ROUTES.RESET_PASSWORD,
	authenticate,
	usersController.resetPassword
);

export default usersRoutes;
