import {
	BadRequestError
} from '../../middlewares/ErrorHandling';
import { SignUpBody } from './types/body';
import usersRepository from './users.repository';
import { validateSignUpData } from './utils/validate';

class UsersService {
	signUp = async (body: SignUpBody) => {
		const errors = validateSignUpData(body);

		if (Object.values(errors).length > 0) {
			throw new BadRequestError(
				'Data provided for sign up is invalid, check the payload',
				errors
			);
		}

		const values = body as Required<SignUpBody>;

		return await usersRepository.signUp(values);
	};
}

const usersService = new UsersService();

export default usersService;
