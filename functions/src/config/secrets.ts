import { defineSecret } from 'firebase-functions/params';

export const smtpHost = defineSecret('SMTP_HOST');
export const smtpPort = defineSecret('SMTP_PORT');
export const smtpUser = defineSecret('SMTP_USER');
export const smtpPass = defineSecret('SMTP_PASS');
