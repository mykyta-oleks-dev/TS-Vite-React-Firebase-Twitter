import { Request, RequestHandler } from 'express';
import { HTTP } from '../../shared/constants/HTTP';
import { UserInfoBody, SignUpBody } from './types/body';
import usersService from './users.service';
import { UnauthorizedError } from '../../middlewares/ErrorHandling';
import { ERRORS } from './constants/Errors';

class UsersController {
	signUp: RequestHandler = async (req: Request<{}, {}, SignUpBody>, res) => {
		const body = req.body;

		const { token } = await usersService.signUp(body);

		res.status(HTTP.CREATED).json({ message: 'Success!', token });
	};

	update: RequestHandler = async (
		req: Request<{}, {}, UserInfoBody>,
		res
	) => {
		const user = req.user;

		if (!user) {
			throw new UnauthorizedError(ERRORS.UNAUTH_UPDATE);
		}

		const body = req.body;

		await usersService.update(user, body);

		res.status(HTTP.OK).json({ message: 'Success!' });
	};
}

const usersController = new UsersController();

export default usersController;
