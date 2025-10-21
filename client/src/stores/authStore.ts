import type { User } from '@/types/User';
import { create } from 'zustand';

export type UserData = {
	user: User;
	emailVerified: boolean;
} | null;

interface UserStore {
	userData: UserData;
	isAuthenticated: boolean;
	isLoading: boolean;

	setUserData: (authState: UserData) => void;
	setAuthenticated: (isAuthenticated: boolean) => void;
	setLoading: (isLoading: boolean) => void;
	updateUser: (user: User) => void;
	reset: () => void;
}

const useUser = create<UserStore>((set) => ({
	userData: null,
	isAuthenticated: false,
	isLoading: false,

	setUserData: (userData) => set({ userData }),
	setAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated }),
	setLoading: (isLoading: boolean) => set({ isLoading }),
	updateUser: (user) =>
		set((prev) => ({
			userData: prev.userData
				? {
						...prev.userData,
						user,
				  }
				: prev.userData,
		})),
	reset: () => set({ userData: null, isAuthenticated: false }),
}));

export default useUser;
