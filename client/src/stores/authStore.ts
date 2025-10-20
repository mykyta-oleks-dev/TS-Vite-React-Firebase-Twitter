import type { User } from '@/types/User';
import { create } from 'zustand';

export type UserData = {
	user: User;
	emailVerified: boolean;
} | null;

interface AuthStore {
	userData: UserData;
	isAuthenticated: boolean;

	setUserData: (authState: UserData) => void;
	setAuthenticated: (isAuthenticated: boolean) => void;
	logOut: () => void;
}

const useAuthState = create<AuthStore>((set) => ({
	userData: null,
	isAuthenticated: false,

	setUserData: (userData) => set({ userData }),
	setAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated }),
	logOut: () => set({ userData: null, isAuthenticated: false }),
}));

export default useAuthState;
