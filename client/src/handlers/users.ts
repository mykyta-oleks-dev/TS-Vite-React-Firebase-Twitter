import { resendVerification, signUp, signUpFinish } from '@/api/users';
import { auth, googleAuthProvider } from '@/config/firebase';
import router from '@/config/router';
import { ROUTER_KEYS } from '@/constants/routes';
import { handleError } from '@/lib/utils';
import type { logInData, signUpData, signUpFinishData } from '@/schemas/auth';
import {
	signInWithCustomToken,
	signInWithEmailAndPassword,
	signInWithPopup,
	signOut,
} from 'firebase/auth';
import { uploadAvatar } from '../firebase/storage';
import { toast } from 'sonner';

export const handleSignUp = async (values: signUpData) => {
	try {
		const avatar = await uploadAvatar(values.avatar);

		const { data } = await signUp(values, avatar);

		await signInWithCustomToken(auth, data.token);
		router.navigate(ROUTER_KEYS.ROOT);
	} catch (err) {
		handleError(err, true);
	}
};

export const handleSignUpFinish = async (values: signUpFinishData) => {
	try {
		const avatar = await uploadAvatar(values.avatar);

		const { data } = await signUpFinish(values, avatar);

		await signInWithCustomToken(auth, data.token);
		router.navigate(ROUTER_KEYS.ROOT);
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
		router.navigate(ROUTER_KEYS.ROOT);
	} catch (err) {
		handleError(err, true);
	}
};

export const handleGoogleAuth = async () => {
	try {
		await signInWithPopup(auth, googleAuthProvider).then(() => {
			router.navigate(ROUTER_KEYS.ROOT);
		});
	} catch (err) {
		handleError(err, true);
	}
};

export const handleSignOut = () => signOut(auth);

export const handleResendVerification = async () => {
	try {
		await resendVerification().then(() =>
			toast.success('Verification link was sent to your email')
		);
	} catch (err) {
		handleError(err, true);
	}
};
