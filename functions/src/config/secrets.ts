import { defineSecret } from 'firebase-functions/params';

export const smtpHost = defineSecret('SMTP_HOST');
export const smtpPort = defineSecret('SMTP_PORT');
export const smtpUser = defineSecret('SMTP_USER');
export const smtpPass = defineSecret('SMTP_PASS');

export const algoliaAppId = defineSecret('ALGOLIA_APP_ID');
export const algoliaReadApiKey = defineSecret('ALGOLIA_READ_API_KEY');
export const algoliaWriteApiKey = defineSecret('ALGOLIA_WRITE_API_KEY');
export const algoliaIndex = defineSecret('ALGOLIA_INDEX');
