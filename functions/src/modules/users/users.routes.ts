import { Router } from "express";
import authenticate from "../../middlewares/Authentication";
import usersController from "./users.controller";

const usersRoutes = Router();

usersRoutes.post('/sign-up', usersController.signUp);
usersRoutes.patch('/update', authenticate, usersController.update);

export default usersRoutes;
