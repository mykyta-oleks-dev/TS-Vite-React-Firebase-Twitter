import { getOne } from '@/api/users';
import { auth } from '@/config/firebase';
import router from '@/config/router';
import { ROUTES } from '@/constants/routes';
import { parseFetchUser, type User } from '@/types/User';
import axios from 'axios';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';

const useAuth = ():
	| { user: null; authLoading: true }
	| { user: User | null; authLoading: false } => {
	const [user, setUser] = useState<User | null>(null);
	const [authLoading, setAuthLoading] = useState(false);

	useEffect(() => {
		setAuthLoading(true);
		const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
			if (currentUser) {
				try {
					const { data } = await getOne(currentUser.uid);

					const { user: userData } = data;

					const user = parseFetchUser(userData);

					setUser(user);
				} catch (err) {
					if (
						axios.isAxiosError(err) &&
						err.status &&
						err.status === 404
					) {
						console.log(err);
						router.navigate(ROUTES.SIGN_UP_GOOGLE_FINISH);
					}
				}
			} else {
				setUser(null);
			}
			setAuthLoading(false);
		});

		// Cleanup subscription on unmount
		return () => unsubscribe();
	}, []);

	if (authLoading)
		return {
			user: null,
			authLoading,
		};

	return { user, authLoading };
};

export default useAuth;
