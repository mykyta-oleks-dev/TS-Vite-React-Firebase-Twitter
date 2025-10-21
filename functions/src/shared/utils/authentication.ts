import { Request } from 'express';
import { UnauthorizedError } from '../../middlewares/ErrorHandling';
import { SHARED_REQ_ERRORS } from '../constants/Errors';

export const getUserOrThrowError = (req: Request) => {
	const user = req.user;

	if (!user) {
		throw new UnauthorizedError(SHARED_REQ_ERRORS.UNAUTH);
	}

	return user;
};
