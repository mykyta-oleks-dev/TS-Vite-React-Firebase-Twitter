import { Stringified } from '../../../shared/types/data/common';
import { UserData } from '../../../shared/types/data/User';

export type UserInfo = Omit<UserData, 'email' | 'isVerified'> & {
	birthday: string
}

export type PasswordsData = {
	password: string;
	confirmPassword: string;
}

export type PasswordsDataBody = Partial<PasswordsData>;

export type PasswordsDataErrors = Partial<Stringified<PasswordsData>>;

type SignUpData = {
	email: string;
} & PasswordsData;

export type SignUp = UserInfo & SignUpData;

export type SignUpBody = Partial<SignUp> & { redirectUrl?: string };

export type SignUpErrors = Partial<Stringified<SignUp>>;

export type UserInfoBody = Partial<UserInfo>;

export type UserInfoErrors = Partial<Stringified<UserInfo>>;
