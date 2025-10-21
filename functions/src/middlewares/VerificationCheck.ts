import { NextFunction, Request, Response } from "express";
import { ForbiddenError, UnauthorizedError } from "./ErrorHandling";

const isVerified = async (req: Request, _res: Response, next: NextFunction) => {
	const user = req.user;

	if (!user) {
		throw new UnauthorizedError('Unauthorized: No token provided')
	}

	if (!user.email_verified) {
		throw new ForbiddenError('Forbidden: User has not verified their email');
	}

	next();
}

export default isVerified;
