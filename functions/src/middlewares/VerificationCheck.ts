import { NextFunction, Request, Response } from "express";
import { ForbiddenError, UnauthorizedError } from "./ErrorHandling";
import { auth } from "../config/firebase";

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
