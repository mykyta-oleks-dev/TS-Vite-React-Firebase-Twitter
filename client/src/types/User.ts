import type { APIObject, AppObject } from "./common";

interface UserPrimitives {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	avatar: string;
	about?: string;
	location?: string;
}

export interface UserApi extends UserPrimitives, APIObject {
	birthday: string;
}

export interface User extends UserPrimitives, AppObject {
	birthday: Date;
}

export const parseFetchUser = (userData: UserApi): User => ({
	...userData,
	
	createdAt: new Date(userData.createdAt),
	updatedAt: new Date(userData.updatedAt),
	birthday: new Date(userData.birthday),
})
