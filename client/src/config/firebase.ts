import { EMULATORS, FIREBASE } from '@/constants/env';
import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: FIREBASE.API_KEY,
	authDomain: FIREBASE.AUTH_DOMAIN,
	projectId: FIREBASE.PROJECT_ID,
	storageBucket: FIREBASE.STORAGE_BUCKET,
	messagingSenderId: FIREBASE.MESSAGING_SENDER_ID,
	appId: FIREBASE.APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase modules
export const firestore = getFirestore(app);

export const googleAuthProvider = new GoogleAuthProvider();
export const auth = getAuth(app);

// Set up auth emulation
if (EMULATORS.AUTH) {
	console.log('emulating auth');
	connectAuthEmulator(auth, EMULATORS.AUTH);
}

export const storage = getStorage(app);
export default app;
