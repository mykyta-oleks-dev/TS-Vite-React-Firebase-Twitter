import { AuthClientErrorCode, FirebaseAuthError } from 'firebase-admin/auth';
import { auth, db } from '../../config/firebase';
import { COLLECTIONS } from '../../shared/constants/Collections';
import { User } from '../../shared/types/data/User';
import { SignUpBody } from './types/body';
import { AppError, ConflictError } from '../../middlewares/ErrorHandling';
import { UserRecord } from 'firebase-functions/v1/auth';

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

		if (!userRecord) throw new AppError('Error creating user record');

		const now = new Date();

		const userData: Omit<User, 'id'> = {
			...values,
			isVerified: false,
			createdAt: now,
			updatedAt: now,
			birthday: new Date(values.birthday),
		};

		await db.collection(COLLECTIONS.USERS).add(userData);

		const token = await auth.createCustomToken(userRecord.uid);

		return { token };
	};
}

const usersRepository = new UsersRepository();

export default usersRepository;
