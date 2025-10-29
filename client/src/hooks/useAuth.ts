import { getOneUser } from '@/api/users';
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
		setIsPassword,
		setUserData,
		setAuthenticated,
		setLoading,
		reset,
	} = useUser(useShallow((s) => s));
	const navigate = useNavigate();

	useEffect(() => {
		setLoading(true);
		const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
			if (currentUser) {
				setAuthenticated(true);
				try {
					const isPasswordProvider = currentUser.providerData.some(
						(p) => p.providerId === 'password'
					);
					const { data } = await getOneUser(currentUser.uid);

					const { user: userData, isVerified } = data;

					if (currentUser.emailVerified !== isVerified) {
						currentUser.getIdToken(true);
					}

					const user = parseFetchUser(userData);

					setUserData({
						user,
						emailVerified: currentUser.emailVerified,
					});
					setLoading(false);
					setIsPassword(isPasswordProvider);
				} catch (err) {
					if (
						axios.isAxiosError(err) &&
						err.status &&
						err.status === 404
					) {
						setLoading(false);
						navigate(ROUTES.SIGN_UP_FINISH);
					}
				}
			} else {
				reset();
				setLoading(false);
			}
		});

		// Cleanup subscription on unmount
		return () => {
			return unsubscribe();
		};
	}, [reset, setLoading, setUserData, setAuthenticated, navigate]);

	if (isLoading)
		return {
			userData: null,
			isAuthenticated,
			authLoading: isLoading,
		};

	return { userData, isAuthenticated, authLoading: isLoading };
};

export default useAuth;
