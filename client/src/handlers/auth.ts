import { auth, googleAuthProvider } from '@/config/firebase';
import router from '@/config/router';
// import { API_ENDPOINTS } from '@/constants/api';
import { ROUTES } from '@/constants/routes';
import { handleError } from '@/lib/utils';
import type { logInData, signUpData } from '@/schemas/auth';
// import type { AuthBody } from '@/types/API';
// import axios from 'axios';
import {
	GoogleAuthProvider,
	// signInWithCustomToken,
	signInWithEmailAndPassword,
	signInWithPopup,
	signOut,
} from 'firebase/auth';
import { redirect } from 'react-router';

export const handleSignUp = async (values: signUpData) => {
	try {
		console.log(values);
		// const res = await axios.post<AuthBody>(API_ENDPOINTS.USERS.SIGN_UP, {
		// 	body: JSON.stringify(values),
		// });

		// const data = res.data;

		// const userCredential = await signInWithCustomToken(auth, data.token);
		// console.log(await userCredential.user.getIdToken());
		// redirect(ROUTES.ROOT);
	} catch (err) {
		handleError(err, true);
	}
};

export const handleLogIn = async (values: logInData) => {
	try {
		const results = await signInWithEmailAndPassword(
			auth,
			values.email,
			values.password
		);
		const user = results.user;
		console.log(await user.getIdToken());
		router.navigate(ROUTES.ROOT);
	} catch (err) {
		handleError(err, true);
	}
};

export const handleGoogleAuth = async () => {
	try {
		await signInWithPopup(auth, googleAuthProvider).then((result) => {
			const credential = GoogleAuthProvider.credentialFromResult(result);
			const token = credential?.accessToken;
			// The signed-in user info.
			const user = result.user;
			console.log(token, user);

			redirect(ROUTES.ROOT);
		});
	} catch (err) {
		handleError(err, true);
	}
};

export const handleSignOut = () => signOut(auth);
