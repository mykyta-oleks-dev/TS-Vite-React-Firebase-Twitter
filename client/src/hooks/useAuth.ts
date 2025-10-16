import { auth } from '@/config/firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { useEffect, useState } from 'react';

const useAuth = ():
	| { user: null; authLoading: true }
	| { user: User | null; authLoading: false } => {
	const [user, setUser] = useState<User | null>(null);
	const [authLoading, setAuthLoading] = useState(false);

	useEffect(() => {
		setAuthLoading(true);
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			setUser(currentUser);
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
