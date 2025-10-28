import { setGlobalOptions } from 'firebase-functions';
import { onRequest } from 'firebase-functions/https';
import app from './app.js';
import {
	algoliaAppId,
	algoliaIndex,
	algoliaReadApiKey,
	algoliaWriteApiKey,
	smtpHost,
	smtpPass,
	smtpPort,
	smtpUser,
} from './config/secrets.js';

setGlobalOptions({ maxInstances: 10 });

export const api = onRequest(
	{
		timeoutSeconds: 30,
		memory: '256MiB',
		serviceAccount: 'firestore-twitter@appspot.gserviceaccount.com',
		secrets: [
			smtpHost,
			smtpPass,
			smtpPort,
			smtpUser,
			algoliaAppId,
			algoliaReadApiKey,
			algoliaWriteApiKey,
			algoliaIndex,
		],
	},
	app
);
