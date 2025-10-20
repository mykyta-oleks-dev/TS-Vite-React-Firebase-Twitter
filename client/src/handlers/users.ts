import {
	changePassword,
	resendVerification,
	signUp,
	signUpFinish,
} from '@/api/users';
import { auth, googleAuthProvider } from '@/config/firebase';
import router from '@/config/router';
import { ROUTER_KEYS } from '@/constants/routes';
import { handleError } from '@/lib/utils';
import type {
	changePasswordData,
	logInData,
	signUpData,
	signUpFinishData,
} from '@/schemas/auth';
import {
	EmailAuthProvider,
	reauthenticateWithCredential,
	signInWithCustomToken,
	signInWithEmailAndPassword,
	signInWithPopup,
	signOut,
} from 'firebase/auth';
import { toast } from 'sonner';
import { uploadAvatar } from '../firebase/storage';

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

export const handleChangePassword = async (
	email: string,
	values: changePasswordData
) => {
	try {
		const user = auth.currentUser;
		if (!user || user.providerId === 'google.com') {
			throw new Error('User not signed in with email/password.');
		}

		const credentials = EmailAuthProvider.credential(
			email,
			values.oldPassword
		);

		await reauthenticateWithCredential(user, credentials);

		changePassword(values.password, values.confirmPassword).then((data) => {
			toast.success(data.message);
		});
	} catch (err) {
		handleError(err, true);
	}
};
