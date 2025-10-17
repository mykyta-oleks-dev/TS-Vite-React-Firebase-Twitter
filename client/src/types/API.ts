import type { UserApi } from './User';

export interface DefaultBody {
	message: string;
}

export interface ErrorResponse extends DefaultBody {
	status: 'error' | 'fail';
	stack?: string;
	errors?: unknown;
	payload?: Record<string, string | number>;
}

export interface AuthBody extends DefaultBody {
	token: string;
}

export interface OneUser extends DefaultBody {
	userData: UserApi;
}

export interface ManyUsers extends DefaultBody {
	usersData: UserApi[];
}
