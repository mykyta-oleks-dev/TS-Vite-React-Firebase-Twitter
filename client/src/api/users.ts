import axiosInstance from '@/config/axios';
import { API_ENDPOINTS } from '@/constants/api';
import type {
	editProfileData,
	signUpData,
	signUpFinishData,
} from '@/schemas/auth';
import type { AuthBody, DefaultBody, OneUser } from '@/types/API';

export const signUp = async (values: signUpData, avatar: string) => {
	const res = await axiosInstance.post<AuthBody>(
		API_ENDPOINTS.USERS.SIGN_UP,
		{
			...values,
			avatar,
		}
	);

	const data = res.data;

	return { data, res };
};

export const signUpFinish = async (
	values: signUpFinishData,
	avatar: string
) => {
	const res = await axiosInstance.post<AuthBody>(
		API_ENDPOINTS.USERS.SIGN_UP_GOOGLE,
		{
			...values,
			avatar,
		}
	);

	const data = res.data;

	return { data, res };
};

export const getOne = async (uid: string) => {
	const res = await axiosInstance.get<OneUser>(
		API_ENDPOINTS.USERS.GET_ONE(uid)
	);

	const data = res.data;

	return { data, res };
};

export const resendVerification = async () =>
	axiosInstance.post(API_ENDPOINTS.USERS.RESEND_VERIFICATION);

export const changePassword = async (
	password: string,
	confirmPassword: string
) => {
	const res = await axiosInstance.post<DefaultBody>(
		API_ENDPOINTS.USERS.CHANGE_PASSWORD,
		{
			password,
			confirmPassword,
		}
	);

	const data = res.data;

	return data;
};

export const updateUser = async (values: editProfileData, avatar: string) =>
	await axiosInstance.put(API_ENDPOINTS.USERS.ROOT, {
		...values,
		avatar,
	});
