import { Router } from "express";
import authenticate from "../../middlewares/Authentication";
import usersController from "./users.controller";

const usersRoutes = Router();

usersRoutes.post('/sign-up', usersController.signUp);
usersRoutes.put('/update', authenticate, usersController.update);
usersRoutes.post('/resend-verification', authenticate, usersController.resendVerification);

export default usersRoutes;
