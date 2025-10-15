import admin from 'firebase-admin';
import { App } from 'firebase-admin/app';

let app: undefined | App;

if (!admin.apps.length || !app) {
	app = admin.initializeApp();
}

export const db = admin.firestore(app);
export const auth = admin.auth(app);
