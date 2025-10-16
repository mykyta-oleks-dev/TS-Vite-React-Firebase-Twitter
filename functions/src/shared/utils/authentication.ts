import { Request } from 'express';
import { UnauthorizedError } from '../../middlewares/ErrorHandling';
import { ERRORS } from '../../modules/users/constants/Errors';

export const getUserOrThrowError = (req: Request) => {
	const user = req.user;

	if (!user) {
		throw new UnauthorizedError(ERRORS.UNAUTH);
	}

	return user;
};
