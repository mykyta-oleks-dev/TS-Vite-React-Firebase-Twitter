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
	logOut: () => void;
}

const useUser = create<UserStore>((set) => ({
	userData: null,
	isAuthenticated: false,
	isLoading: true,

	setUserData: (userData) => set({ userData }),
	setAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated }),
	setLoading: (isLoading: boolean) => set({ isLoading }),
	logOut: () => set({ userData: null, isAuthenticated: false }),
}));

export default useUser;
