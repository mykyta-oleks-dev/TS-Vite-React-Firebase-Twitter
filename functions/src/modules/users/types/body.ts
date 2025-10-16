import { User } from '../../../shared/types/data/User';

type PasswordsData = {
	password?: string;
	confirmPassword?: string;
};

export type SignUpBody = Partial<
	Omit<User, 'id' | 'isVerified' | 'createdAt' | 'updatedAt' | 'birthday'>
> & {
	birthday?: string;
} & PasswordsData;

export type UserInfoBody = Omit<
	SignUpBody,
	'email' | keyof PasswordsData
>;
