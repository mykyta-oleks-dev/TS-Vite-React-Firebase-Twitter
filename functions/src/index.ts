import { setGlobalOptions } from 'firebase-functions';
import { onRequest } from 'firebase-functions/https';
import app from './app';
import { smtpHost, smtpPass, smtpPort, smtpUser } from './config/secrets';

setGlobalOptions({ maxInstances: 10 });

export const api = onRequest(
	{
		timeoutSeconds: 30,
		memory: '256MiB',
		secrets: [smtpHost, smtpPass, smtpPort, smtpUser],
	},
	app
);
