import {
	DecodedIdToken
} from 'firebase-admin/auth';
import { auth, db } from '../../config/firebase';
import {
	NotFoundError
} from '../../middlewares/ErrorHandling';
import { COLLECTIONS } from '../../shared/constants/Collections';
import { User } from '../../shared/types/data/User';
import { SignUp, UserInfo } from './types/body';

class UsersRepository {
	signUp = async (values: SignUp, uid: string) => {

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

		const token = await auth.createCustomToken(uid);

		return { token };
	};

	update = async (userToken: DecodedIdToken, values: UserInfo) => {
		const userSnapshot = await db
			.collection(COLLECTIONS.USERS)
			.where('email', '==', userToken.email)
			.limit(1)
			.get();

		if (userSnapshot.empty) {
			throw new NotFoundError('User data is not found');
		}

		const userData: Omit<UserInfo, 'birthday'> = {
			avatar: values.avatar,
			firstName: values.firstName,
			lastName: values.lastName,
			about: values.about,
			location: values.location,
		};

		const userRef = userSnapshot.docs[0].ref;
		await userRef.update({
			...userData,
			birthday: new Date(values.birthday),
			updatedAt: new Date(),
		});
	};
}

const usersRepository = new UsersRepository();

export default usersRepository;
