import { db } from '../../config/firebase';
import { NotFoundError } from '../../middlewares/ErrorHandling';
import { COLLECTIONS } from '../../shared/constants/Collections';
import { User, userConverter } from '../../shared/types/data/User';
import { REQUEST_ERRORS } from './constants/Errors';
import { SignUp, UserInfo } from './types/body';

class UsersRepository {
	private static readonly _getUserSnapshot = async (uid: string) => {
		const usersSnapshot = await db
			.collection(COLLECTIONS.USERS)
			.where('id', '==', uid)
			.limit(1)
			.get();

		if (usersSnapshot.empty) {
			throw new NotFoundError(REQUEST_ERRORS.NOTFOUND_ONE);
		}

		return usersSnapshot.docs[0];
	};

	signUp = async (
		values: Omit<SignUp, 'password' | 'confirmPassword'>,
		uid: string
	) => {
		const now = new Date();

		const userData: User = {
			id: uid,
			avatar: values.avatar,
			email: values.email,
			firstName: values.firstName,
			lastName: values.lastName,
			about: values.about ?? null,
			location: values.location ?? null,
			createdAt: now,
			updatedAt: now,
			birthday: new Date(values.birthday),
		};

		await db.collection(COLLECTIONS.USERS).add(userData);
	};

	getOne = async (uid: string) => {
		const docSnapshot = await UsersRepository._getUserSnapshot(uid);

		const user = userConverter.fromFirestore(docSnapshot);

		return { user };
	};

	getMany = async (page = 1, limit = 10) => {
		const usersSnapshot = await db
			.collection(COLLECTIONS.USERS)
			.limit(limit)
			.offset((page - 1) * limit)
			.get();

		if (usersSnapshot.empty) {
			throw new NotFoundError(REQUEST_ERRORS.NOTFOUND_MANY);
		}

		const users = usersSnapshot.docs.map((d) => userConverter.fromFirestore(d));

		return { users };
	};

	update = async (uid: string, values: UserInfo) => {
		const docSnapshot = await UsersRepository._getUserSnapshot(uid);
		const userRef = docSnapshot.ref;

		const userData: Omit<UserInfo, 'birthday'> = {
			avatar: values.avatar,
			firstName: values.firstName,
			lastName: values.lastName,
			about: values.about ?? null,
			location: values.location ?? null,
		};

		await userRef.update({
			...userData,
			birthday: new Date(values.birthday),
			updatedAt: new Date(),
		});
	};

	delete = async (uid: string) => {
		(await UsersRepository._getUserSnapshot(uid)).ref.delete();
	};
}

const usersRepository = new UsersRepository();

export default usersRepository;
