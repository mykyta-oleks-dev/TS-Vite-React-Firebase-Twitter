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
import { REQUEST_ERRORS } from './constants/Errors';
import { PasswordsDataBody, SignUpBody, UserInfoBody } from './types/body';
import usersRepository from './users.repository';
import { sendResetPassword, sendVerificationEmail } from './utils/emails';
import {
	assertIsPasswordsData,
	assertIsSignUp,
	assertIsUserInfo,
	validateEmail,
	validatePasswords,
	validateSignUpBody,
	validateUserInfo,
} from './utils/validate';
import { isNotEmptyObj, validateQuery } from '../../shared/utils/validation';
import { SHARED_REQ_ERRORS } from '../../shared/constants/Errors';

class UsersService {
	signUp = async (body: SignUpBody, redirectUrl?: string) => {
		const errors = validateSignUpBody(body);

		if (!assertIsSignUp(body, errors)) {
			throw new BadRequestError(REQUEST_ERRORS.BADREQUEST_SIGNUP, errors);
		}

		let userRecord: UserRecord | undefined = undefined;
		try {
			userRecord = await auth.createUser({
				displayName: `${body.firstName} ${body.lastName}`,
				email: body.email,
				password: body.password,
				photoURL: body.avatar,
			});

			await sendVerificationEmail(body.email, redirectUrl);
		} catch (err: unknown) {
			if (
				err instanceof FirebaseAuthError &&
				err.hasCode(AuthClientErrorCode.EMAIL_ALREADY_EXISTS.code)
			) {
				throw new ConflictError(
					AuthClientErrorCode.EMAIL_ALREADY_EXISTS.message
				);
			}
			throw err;
		}

		if (!userRecord) throw new AppError(REQUEST_ERRORS.CREATE_ERROR);

		try {
			await usersRepository.signUp(body, userRecord.uid);
		} catch (err) {
			await auth.deleteUser(userRecord.uid);
			throw err;
		}

		const token = await auth.createCustomToken(userRecord.uid);

		return { token };
	};

	signUpGoogle = async (user: DecodedIdToken, body: UserInfoBody) => {
		const errors = validateUserInfo(body);

		if (!assertIsUserInfo(body, errors)) {
			throw new BadRequestError(REQUEST_ERRORS.BADREQUEST_SIGNUP, errors);
		}

		const emailError = validateEmail(user.email);

		if (!user.email || emailError) {
			throw new AppError(emailError ?? REQUEST_ERRORS.BADREQUEST_NOEMAIL);
		}

		let userRecord: UserRecord | undefined = undefined;
		try {
			userRecord = await auth.updateUser(user.uid, {
				displayName: `${body.firstName} ${body.lastName}`,
				photoURL: body.avatar,
				email: user.email,
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
			throw err;
		}

		if (!userRecord) throw new AppError(REQUEST_ERRORS.UPDATE_ERROR);

		await usersRepository.signUp(
			{
				...body,
				email: user.email,
			},
			user.uid
		);

		const token = await auth.createCustomToken(userRecord.uid);

		return { token };
	};

	getOne = async (uid?: string) => {
		if (!uid) throw new BadRequestError(REQUEST_ERRORS.BADREQUEST_NOUID);

		try {
			await auth.getUser(uid);
		} catch {
			throw new NotFoundError(REQUEST_ERRORS.NOTFOUND_ONE);
		}

		return usersRepository.getOne(uid);
	};

	getMany = async (query: { page?: string; limit?: string }) => {
		const errors = validateQuery(query);

		if (isNotEmptyObj(errors)) {
			throw new BadRequestError(SHARED_REQ_ERRORS.BADREQUEST_QUERY, errors);
		}

		const { page, limit } = query;

		const pageParsed = page ? Number.parseInt(page) : undefined;
		const limitParsed = limit ? Number.parseInt(limit) : undefined;

		return usersRepository.getMany(pageParsed, limitParsed);
	};

	update = async (user: DecodedIdToken, body: UserInfoBody) => {
		const errors = validateUserInfo(body);

		if (!assertIsUserInfo(body, errors)) {
			throw new BadRequestError(REQUEST_ERRORS.BADREQUEST_UPDATE, errors);
		}

		const { displayName: oldDisplayName, photoURL: oldPhotoURL } =
			await auth.getUser(user.uid);

		let userRecord: UserRecord | undefined = undefined;
		try {
			userRecord = await auth.updateUser(user.uid, {
				displayName: `${body.firstName} ${body.lastName}`,
				photoURL: body.avatar,
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
			throw err;
		}

		if (!userRecord) throw new AppError(REQUEST_ERRORS.UPDATE_ERROR);

		try {
			await usersRepository.update(user.uid, body);
		} catch (err) {
			await auth.updateUser(user.uid, {
				displayName: oldDisplayName,
				photoURL: oldPhotoURL,
			});
			throw err;
		}
	};

	delete = async (user: DecodedIdToken) => {
		try {
			await auth.deleteUser(user.uid);
			await usersRepository.delete(user.uid);
		} catch (err) {
			if (
				err instanceof FirebaseAuthError &&
				err.hasCode(AuthClientErrorCode.NOT_FOUND.code)
			) {
				throw new NotFoundError(AuthClientErrorCode.NOT_FOUND.message);
			}
			throw err;
		}
	};

	resendVerification = async (user: DecodedIdToken, redirectUrl?: string) => {
		const emailError = validateEmail(user.email);

		if (!user.email || emailError) {
			throw new BadRequestError(
				emailError ?? REQUEST_ERRORS.BADREQUEST_NOEMAIL
			);
		}

		await sendVerificationEmail(user.email, redirectUrl);
	};

	changePassword = async (user: DecodedIdToken, body: PasswordsDataBody) => {
		const errors = validatePasswords(body);

		if (!assertIsPasswordsData(body, errors)) {
			throw new BadRequestError(
				REQUEST_ERRORS.BADREQUEST_RESETPSW,
				errors
			);
		}

		await auth.updateUser(user.uid, {
			password: body.password,
		});
	};

	resetPassword = async (email?: string, redirectUrl?: string) => {
		const emailError = validateEmail(email);

		if (!email || emailError) {
			throw new BadRequestError(
				emailError ?? REQUEST_ERRORS.BADREQUEST_NOEMAIL
			);
		}

		await sendResetPassword(email, redirectUrl);
	};
}

const usersService = new UsersService();

export default usersService;
