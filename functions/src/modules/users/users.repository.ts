import {
	AuthClientErrorCode,
	DecodedIdToken,
	FirebaseAuthError,
} from 'firebase-admin/auth';
import { UserRecord } from 'firebase-functions/v1/auth';
import { auth, db } from '../../config/firebase';
import {
	AppError,
	ConflictError,
	NotFoundError,
} from '../../middlewares/ErrorHandling';
import { COLLECTIONS } from '../../shared/constants/Collections';
import { User } from '../../shared/types/data/User';
import { SignUpBody, UserInfoBody } from './types/body';
import { ERRORS } from './constants/Errors';

class UsersRepository {
	signUp = async (values: Required<SignUpBody>) => {
		let userRecord: UserRecord | undefined = undefined;
		try {
			userRecord = await auth.createUser({
				displayName: `${values.firstName} ${values.lastName}`,
				email: values.email,
				password: values.password,
				photoURL: values.avatar,
			});
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

		const now = new Date();

		const userData: Omit<User, 'id'> = {
			avatar: values.avatar,
			email: values.email,
			firstName: values.firstName,
			lastName: values.lastName,
			about: values.about,
			location: values.location,
			isVerified: false,
			createdAt: now,
			updatedAt: now,
			birthday: new Date(values.birthday),
		};

		await db.collection(COLLECTIONS.USERS).add(userData);

		const token = await auth.createCustomToken(userRecord.uid);

		return { token };
	};

	update = async (
		userToken: DecodedIdToken,
		values: UserInfoBody
	) => {
		let userRecord: UserRecord | undefined = undefined;
		try {
			userRecord = await auth.updateUser(userToken.uid, {
				displayName: `${values.firstName} ${values.lastName}`,
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

		const userSnapshot = await db
			.collection(COLLECTIONS.USERS)
			.where('email', '==', userToken.email)
			.limit(1)
			.get();

		if (userSnapshot.empty) {
			throw new NotFoundError('User data is not found');
		}

		const userData: UserInfoBody = {
			avatar: values.avatar,
			firstName: values.firstName,
			lastName: values.lastName,
			about: values.about,
			location: values.location,
		}

		const userRef = userSnapshot.docs[0].ref;
		await userRef.update({
			...userData,
			birthday: values.birthday ? new Date(values.birthday) : undefined,
			updatedAt: new Date()
		});
	};
}

const usersRepository = new UsersRepository();

export default usersRepository;
