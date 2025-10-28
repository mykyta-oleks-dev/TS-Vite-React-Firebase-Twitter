import { NextFunction, Request, Response } from "express";
import { ForbiddenError, UnauthorizedError } from "./ErrorHandling.js";
import { auth } from "../config/firebase.js";

const isVerified = async (req: Request, _res: Response, next: NextFunction) => {
	const user = req.user;

	if (!user) {
		throw new UnauthorizedError('Unauthorized: No token provided')
	}

	const freshUser = await auth.getUser(user.uid);

	if (!freshUser.emailVerified) {
		throw new ForbiddenError('Forbidden: User has not verified their email');
	}

	next();
}

export default isVerified;
