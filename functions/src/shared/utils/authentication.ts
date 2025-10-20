import { Request } from 'express';
import { UnauthorizedError } from '../../middlewares/ErrorHandling';
import { REQUEST_ERRORS } from '../../modules/users/constants/Errors';

export const getUserOrThrowError = (req: Request) => {
	const user = req.user;
	console.log({ user });

	if (!user) {
		throw new UnauthorizedError(REQUEST_ERRORS.UNAUTH);
	}

	return user;
};
