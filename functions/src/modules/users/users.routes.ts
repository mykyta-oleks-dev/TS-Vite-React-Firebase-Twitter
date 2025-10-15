import { Router } from "express";
import usersController from "./users.controller";

const usersRoutes = Router();

usersRoutes.post('/sign-up', usersController.signUp);
usersRoutes.post('/log-in', usersController.logIn);

export default usersRoutes;
