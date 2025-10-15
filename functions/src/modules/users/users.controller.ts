import { Request, RequestHandler } from 'express';
import { HTTP } from '../../shared/constants/HTTP';
import { LogInBody, SignUpBody } from './types/body';
import usersService from './users.service';

class UsersController {
	signUp: RequestHandler = async (req: Request<{}, {}, SignUpBody>, res) => {
		const body = req.body;

		const { token } = await usersService.signUp(body);

		res.status(HTTP.CREATED).json({ message: 'Success!', token });
	};

	logIn: RequestHandler = (req: Request<{}, {}, LogInBody>, res) => {
		const body = req.body;
		console.log(body);

		res.status(HTTP.OK).json({ message: 'Success!' });
	};
}

const usersController = new UsersController();

export default usersController;
