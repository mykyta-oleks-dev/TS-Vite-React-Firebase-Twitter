import { getOne } from '@/api/users';
import { auth } from '@/config/firebase';
import { ROUTES } from '@/constants/routes';
import useUser, { type UserData } from '@/stores/authStore';
import { parseFetchUser } from '@/types/User';
import axios from 'axios';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useShallow } from 'zustand/shallow';

const useAuth = ():
	| { userData: null; isAuthenticated: boolean; authLoading: true }
	| {
			userData: UserData | null;
			isAuthenticated: boolean;
			authLoading: false;
	  } => {
	const {
		userData,
		isAuthenticated,
		isLoading,
		setUserData,
		setAuthenticated,
		setLoading,
		logOut,
	} = useUser(useShallow((s) => s));
	const navigate = useNavigate();

	useEffect(() => {
		setLoading(true);
		const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
			if (currentUser) {
				try {
					const { data } = await getOne(currentUser.uid);

					const { user: userData } = data;

					const user = parseFetchUser(userData);

					console.log(user);

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
				} finally {
					setAuthenticated(true);
					setLoading(false);
				}
			} else {
				logOut();
				setLoading(false);
			}
		});

		// Cleanup subscription on unmount
		return () => {
			console.log('unsubscribed');
			return unsubscribe();
		};
	}, [logOut, setLoading, setUserData, setAuthenticated, navigate]);

	if (isLoading)
		return {
			userData: null,
			isAuthenticated,
			authLoading: isLoading,
		};

	return { userData, isAuthenticated, authLoading: isLoading };
};

export default useAuth;
