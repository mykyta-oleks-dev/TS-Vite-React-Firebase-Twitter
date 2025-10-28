import { setGlobalOptions } from 'firebase-functions';
import { onRequest } from 'firebase-functions/https';
import app from './app.js';
import { smtpHost, smtpPass, smtpPort, smtpUser } from './config/secrets.js';

setGlobalOptions({ maxInstances: 10 });

export const api = onRequest(
	{
		timeoutSeconds: 30,
		memory: '256MiB',
		secrets: [smtpHost, smtpPass, smtpPort, smtpUser],
	},
	app
);
