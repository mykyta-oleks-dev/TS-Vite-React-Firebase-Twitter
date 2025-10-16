import { Request, RequestHandler } from 'express';
import { ConflictError } from '../../middlewares/ErrorHandling';
import { HTTP } from '../../shared/constants/HTTP';
import { getUserOrThrowError } from '../../shared/utils/authentication';
import { ERRORS } from './constants/Errors';
import { PasswordsDataBody, SignUpBody, UserInfoBody } from './types/body';
import usersService from './users.service';

class UsersController {
	signUp: RequestHandler = async (req: Request<{}, {}, SignUpBody>, res) => {
		const body = req.body;

		const { token } = await usersService.signUp(body);

		res.status(HTTP.CREATED).json({
			message: 'Signed up successfuly!',
			token,
		});
	};

	update: RequestHandler = async (
		req: Request<{}, {}, UserInfoBody>,
		res
	) => {
		const user = getUserOrThrowError(req);

		const body = req.body;

		await usersService.update(user, body);

		res.status(HTTP.OK).json({ message: 'Profile updated successfuly!' });
	};

	resendVerification: RequestHandler = async (req, res) => {
		const user = getUserOrThrowError(req);

		if (user.email_verified) {
			throw new ConflictError(ERRORS.ALREADY_VERIFIED);
		}

		const { redirectUrl } = req.body as { redirectUrl?: string };

		await usersService.resendVerification(user, redirectUrl);

		res.status(HTTP.OK).json({ message: 'Verification link was resent!' });
	};

	changePassword: RequestHandler = async (
		req: Request<{}, {}, PasswordsDataBody>,
		res
	) => {
		const user = getUserOrThrowError(req);

		const body = req.body;

		await usersService.changePassword(user, body);

		res.status(HTTP.OK).json({
			message:
				'Password was changed successfuly! Your sessions were terminated and you have to log back in.',
		});
	};
}

const usersController = new UsersController();

export default usersController;
