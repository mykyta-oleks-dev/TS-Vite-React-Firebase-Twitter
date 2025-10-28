import { Stringified } from '../../../shared/types/data/common.js';
import { UserData } from '../../../shared/types/data/User.js';

export type UserInfo = Omit<UserData, 'email' > & {
	birthday: string
}

export type UserInfoBody = Partial<UserInfo>;

export type UserInfoErrors = Partial<Stringified<UserInfo>>;

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

export type SignUpBody = Partial<SignUp>;

export type SignUpErrors = Partial<Stringified<SignUp>>;
