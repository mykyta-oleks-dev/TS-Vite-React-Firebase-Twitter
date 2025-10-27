import {
	changePassword,
	deleteUser,
	resendVerification,
	resetPassword,
	signUp,
	signUpFinish,
	updateUser,
} from '@/api/users';
import { auth, googleAuthProvider } from '@/config/firebase';
import router from '@/config/router';
import { ROUTER_KEYS, ROUTES } from '@/constants/routes';
import { handleError } from '@/lib/utils';
import type {
	changePasswordData,
	editProfileData,
	logInData,
	resetPasswordData,
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
import { deleteFile, uploadFile } from '../firebase/storage';
import type { User } from '@/types/User';
import { FOLDERS } from '@/constants/storage';

export const handleSignUp = async (values: signUpData) => {
	try {
		const avatar = await uploadFile(values.avatar, FOLDERS.AVATARS);

		const { data } = await signUp(values, avatar);

		await signInWithCustomToken(auth, data.token);
		router.navigate(ROUTER_KEYS.ROOT);
	} catch (err) {
		handleError(err, true);
	}
};

export const handleSignUpFinish = async (values: signUpFinishData) => {
	try {
		const avatar = await uploadFile(values.avatar, FOLDERS.AVATARS);

		const { data } = await signUpFinish(values, avatar);

		await signInWithCustomToken(auth, data.token);
		router.navigate(ROUTER_KEYS.ROOT);
	} catch (err) {
		handleError(err, true);
	}
};

export const handleLogIn = async (values: logInData) => {
	try {
		await signInWithEmailAndPassword(
			auth,
			values.email,
			values.password
		);

		router.navigate(ROUTES.ROOT);
	} catch (err) {
		handleError(err, true);
	}
};

export const handleGoogleAuth = async () => {
	try {
		await signInWithPopup(auth, googleAuthProvider).then(async () => {
			router.navigate(ROUTES.ROOT);
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

export const handleUpdateUser = async (
	user: User,
	values: editProfileData,
	callback?: (data: editProfileData, avatar: string) => void
) => {
	try {
		const avatar = values.avatar
			? await uploadFile(values.avatar, FOLDERS.AVATARS)
			: user.avatar;
		await updateUser(values, avatar);
		if (values.avatar) await deleteFile(user.avatar);

		callback?.(values, avatar);

		router.navigate(ROUTES.MY_PROFILE);
	} catch (err) {
		handleError(err, true);
	}
};

export const handleResetPassword = async (values: resetPasswordData) => {
	try {
		await resetPassword(values).then(() =>
			toast.success('The password reset link was sent at provided email.')
		);

		router.navigate(ROUTES.LOG_IN);
	} catch (err) {
		handleError(err, true);
	}
};

export const handleDeleteAccount = async (
	avatar: string,
	callback?: () => void
) => {
	try {
		await deleteUser();
		await deleteFile(avatar);
		await signOut(auth);

		callback?.();

		toast.success('Your account was successfuly deleted');

		router.navigate(ROUTES.ROOT);
	} catch (err) {
		handleError(err, true);
	}
};
