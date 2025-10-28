import nodemailer from 'nodemailer';
import { smtpHost, smtpPass, smtpPort, smtpUser } from './secrets.js';

export const getEtherealConfig = () => {
	const ETHEREAL = {
		HOST: smtpHost.value(),
		PORT: +smtpPort.value(),
		USER: smtpUser.value(),
		PASS: smtpPass.value(),
	} as const;

	return ETHEREAL;
};

export const getTransport = () => {
	const ETHEREAL = getEtherealConfig();

	const transport = nodemailer.createTransport({
		host: ETHEREAL.HOST,
		port: ETHEREAL.PORT,
		secure: false,
		auth: {
			user: ETHEREAL.USER,
			pass: ETHEREAL.PASS,
		},
	});

	return transport;
};

export default getTransport;
