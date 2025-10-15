import { User } from '../../../shared/types/data/User';

export type LogInBody = { email?: string; password?: string };

export type SignUpBody = Partial<
	Omit<User, 'isVerified' | 'createdAt' | 'updatedAt' | 'birthday'>
> & {
	password?: string;
	confirmPassword?: string;
	birthday?: string;
};
