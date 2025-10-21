import { Request, RequestHandler } from 'express';
import { ConflictError } from '../../middlewares/ErrorHandling';
import { HTTP } from '../../shared/constants/HTTP';
import { getUserOrThrowError } from '../../shared/utils/authentication';
import { REQUEST_ERRORS } from './constants/Errors';
import { PasswordsDataBody, SignUpBody, UserInfoBody } from './types/body';
import usersService from './users.service';

class UsersController {
	signUp: RequestHandler = async (
		req: Request<{}, {}, SignUpBody & { redirectUrl?: string }>,
		res
	) => {
		const { redirectUrl, ...body } = req.body;

		const { token } = await usersService.signUp(body, redirectUrl);

		res.status(HTTP.CREATED).json({
			message: 'Signed up successfuly!',
			token,
		});
	};

	signUpGoogle: RequestHandler = async (
		req: Request<{}, {}, UserInfoBody>,
		res
	) => {
		const user = getUserOrThrowError(req);

		const body = req.body;

		const { token } = await usersService.signUpGoogle(user, body);

		res.status(201).json({
			message:
				'User profile created from Google account data successfuly!',
			token,
		});
	};

	getOne: RequestHandler = async (req: Request<{ uid?: string }>, res) => {
		const { uid } = req.params;

		const { user } = await usersService.getOne(uid);

		res.status(200).json({ message: 'User fetched successfuly!', user });
	};

	getMany: RequestHandler = async (
		req: Request<{}, {}, {}, { page?: string; limit?: string }>,
		res
	) => {
		const query = req.query;

		const { users } = await usersService.getMany(query);

		res.status(200).json({ message: 'Users fetched succesfuly!', users });
	};

	update: RequestHandler = async (
		req: Request<{}, {}, UserInfoBody>,
		res
	) => {
		const user = getUserOrThrowError(req);

		const body = req.body;

		await usersService.update(user, body);

		res.status(HTTP.NO_CONTENT).send();
	};

	delete: RequestHandler = async (req, res) => {
		const user = getUserOrThrowError(req);

		await usersService.delete(user);

		res.status(HTTP.NO_CONTENT).send();
	};

	resendVerification: RequestHandler = async (req, res) => {
		const user = getUserOrThrowError(req);

		if (user.email_verified) {
			throw new ConflictError(REQUEST_ERRORS.ALREADY_VERIFIED);
		}

		const { redirectUrl } = req.body as { redirectUrl?: string };

		await usersService.resendVerification(user, redirectUrl);

		res.status(HTTP.NO_CONTENT).send();
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
				'Password was changed successfuly! Your sessions were terminated and you may have to log back in.',
		});
	};

	resetPassword: RequestHandler = async (req, res) => {
		const { redirectUrl, email } = req.body as { redirectUrl?: string; email?: string };

		await usersService.resetPassword(email, redirectUrl);

		res.status(HTTP.NO_CONTENT).send();
	};
}

const usersController = new UsersController();

export default usersController;
