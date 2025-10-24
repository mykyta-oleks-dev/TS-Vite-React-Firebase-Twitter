import { Router } from 'express';
import forceAuthenticate from '../../middlewares/Authentication';
import usersController from './users.controller';
import { ROUTES } from './constants/Routes';

const usersRoutes = Router();

usersRoutes.post(ROUTES.SIGN_UP, usersController.signUp);
usersRoutes.post(
	ROUTES.SIGN_UP_GOOGLE,
	forceAuthenticate,
	usersController.signUpGoogle
);
usersRoutes.get(ROUTES.DYNAMIC, usersController.getOne);
usersRoutes.get(ROUTES.ROOT, usersController.getMany);
usersRoutes.put(ROUTES.ROOT, forceAuthenticate, usersController.update);
usersRoutes.delete(ROUTES.ROOT, forceAuthenticate, usersController.delete);
usersRoutes.post(
	ROUTES.RESEND_VERIFICATION,
	forceAuthenticate,
	usersController.resendVerification
);
usersRoutes.post(
	ROUTES.CHANGE_PASSWORD,
	forceAuthenticate,
	usersController.changePassword
);
usersRoutes.post(ROUTES.RESET_PASSWORD, usersController.resetPassword);

export default usersRoutes;
