import { getOne } from '@/api/users';
import { auth } from '@/config/firebase';
import { ROUTES } from '@/constants/routes';
import useAuthState, { type UserData } from '@/stores/authStore';
import { parseFetchUser } from '@/types/User';
import axios from 'axios';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

const useAuth = ():
	| { userData: null; isAuthenticated: boolean; authLoading: true }
	| {
			userData: UserData | null;
			isAuthenticated: boolean;
			authLoading: false;
	  } => {
	const { userData, isAuthenticated, setUserData, setAuthenticated, logOut } =
		useAuthState();
	const [authLoading, setAuthLoading] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		setAuthLoading(true);
		const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
			if (currentUser) {
				setAuthenticated(true);
				try {
					const { data } = await getOne(currentUser.uid);

					const { user: userData } = data;

					const user = parseFetchUser(userData);

					setUserData({
						user,
						emailVerified: currentUser.emailVerified,
					});
				} catch (err) {
					if (
						axios.isAxiosError(err) &&
						err.status &&
						err.status === 404
					) {
						navigate(ROUTES.SIGN_UP_FINISH);
					}
				}
			} else {
				logOut();
			}
			setAuthLoading(false);
		});

		// Cleanup subscription on unmount
		return () => unsubscribe();
	}, [logOut, setUserData, navigate]);

	if (authLoading)
		return {
			userData: null,
			isAuthenticated,
			authLoading,
		};

	return { userData, isAuthenticated, authLoading };
};

export default useAuth;
