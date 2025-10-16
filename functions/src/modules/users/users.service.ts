import {
	AuthClientErrorCode,
	DecodedIdToken,
	FirebaseAuthError,
} from 'firebase-admin/auth';
import { UserRecord } from 'firebase-functions/v1/auth';
import { auth } from '../../config/firebase';
import {
	AppError,
	BadRequestError,
	ConflictError,
	NotFoundError,
} from '../../middlewares/ErrorHandling';
import { ERRORS } from './constants/Errors';
import { SignUpBody, UserInfoBody } from './types/body';
import usersRepository from './users.repository';
import {
	assertIsSignUp,
	assertIsUserInfo,
	validateSignUpBody,
	validateUserInfo,
} from './utils/validate';
import { sendVerificationEmail } from './utils/verification';

class UsersService {
	signUp = async (body: SignUpBody) => {
		const errors = validateSignUpBody(body);

		if (!assertIsSignUp(body, errors)) {
			throw new BadRequestError(ERRORS.BADREQUEST_SIGNUP, errors);
		}

		let userRecord: UserRecord | undefined = undefined;
		try {
			userRecord = await auth.createUser({
				displayName: `${body.firstName} ${body.lastName}`,
				email: body.email,
				password: body.password,
				photoURL: body.avatar,
			});

			await sendVerificationEmail(body.email, body.redirectUrl);
		} catch (err: unknown) {
			if (
				err instanceof FirebaseAuthError &&
				err.hasCode(AuthClientErrorCode.EMAIL_ALREADY_EXISTS.code)
			) {
				throw new ConflictError(
					AuthClientErrorCode.EMAIL_ALREADY_EXISTS.message
				);
			}
		}

		if (!userRecord) throw new AppError(ERRORS.CREATE_ERROR);

		return await usersRepository.signUp(body, userRecord.uid);
	};

	update = async (user: DecodedIdToken, body: UserInfoBody) => {
		const errors = validateUserInfo(body);

		if (!assertIsUserInfo(body, errors)) {
			throw new BadRequestError(ERRORS.BADREQUEST_UPDATE, errors);
		}

		let userRecord: UserRecord | undefined = undefined;
		try {
			userRecord = await auth.updateUser(user.uid, {
				displayName: `${body.firstName} ${body.lastName}`,
			});
		} catch (err) {
			if (
				err instanceof FirebaseAuthError &&
				err.hasCode(AuthClientErrorCode.INVALID_UID.code)
			) {
				throw new NotFoundError(
					AuthClientErrorCode.INVALID_UID.message
				);
			}
		}

		if (!userRecord) throw new AppError(ERRORS.CREATE_ERROR);

		await usersRepository.update(user, body);
	};

	resendVerification = async (user: DecodedIdToken, redirectUrl?: string) => {
		if (!user.email)
			throw new AppError('User has no email coupled to their record');

		await sendVerificationEmail(user.email, redirectUrl);
	};
}

const usersService = new UsersService();

export default usersService;
