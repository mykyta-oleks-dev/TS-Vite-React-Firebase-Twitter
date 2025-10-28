import { Request } from 'express';
import { UnauthorizedError } from '../../middlewares/ErrorHandling.js';
import { SHARED_REQ_ERRORS } from '../constants/Errors.js';

export const getUserOrThrowError = (req: Request) => {
	const user = req.user;

	if (!user) {
		throw new UnauthorizedError(SHARED_REQ_ERRORS.UNAUTH);
	}

	return user;
};
