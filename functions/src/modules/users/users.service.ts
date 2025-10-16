import { DecodedIdToken } from 'firebase-admin/auth';
import { BadRequestError } from '../../middlewares/ErrorHandling';
import { isNotEmptyObj } from '../../shared/utils/validation';
import { ERRORS } from './constants/Errors';
import { SignUpBody, UserInfoBody } from './types/body';
import usersRepository from './users.repository';
import { validateSignUpData, validateUserInfo } from './utils/validate';

class UsersService {
	signUp = async (body: SignUpBody) => {
		const errors = validateSignUpData(body);

		if (isNotEmptyObj(errors)) {
			throw new BadRequestError(ERRORS.BADREQUEST_SIGNUP, errors);
		}

		const values = body as Required<SignUpBody>;

		return await usersRepository.signUp(values);
	};

	update = async (user: DecodedIdToken, body: UserInfoBody) => {
		const errors = validateUserInfo(body);

		if (isNotEmptyObj(errors)) {
			throw new BadRequestError(ERRORS.BADREQUEST_SIGNUP, errors);
		}

		const values = body as Required<UserInfoBody>;

		await usersRepository.update(user, values)
	};
}

const usersService = new UsersService();

export default usersService;
