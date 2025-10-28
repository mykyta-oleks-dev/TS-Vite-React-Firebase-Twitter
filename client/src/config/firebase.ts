import { EMULATORS, FIREBASE, IS_DEV } from '@/constants/env';
import { initializeApp } from 'firebase/app';
import {
	connectAuthEmulator,
	getAuth,
	GoogleAuthProvider,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { connectStorageEmulator, getStorage } from 'firebase/storage';

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

export const storage = getStorage(app);

if (IS_DEV && EMULATORS.HOST) {
	// Set up auth emulation
	if (EMULATORS.AUTH_PORT) {
		console.log('emulating auth');
		connectAuthEmulator(auth, `http://${EMULATORS.HOST}:${EMULATORS.AUTH_PORT}`);
	}

	// Set up storage emulation
    const storagePort = Number.parseInt(EMULATORS.STORAGE_PORT as string, 10);
    
    if (!Number.isNaN(storagePort)) {
		console.log('emulating storage');
		connectStorageEmulator(storage, EMULATORS.HOST, EMULATORS.STORAGE_PORT);
	}
}
export default app;
