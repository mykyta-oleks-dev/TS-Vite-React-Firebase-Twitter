import nodemailer from 'nodemailer';

export const ETHEREAL = {
	HOST: process.env.SMTP_HOST ?? 'smtp.ethereal.email',
	PORT: process.env.SMTP_PORT ? +process.env.SMTP_PORT : 587,
	USER: process.env.SMTP_USER ?? 'john.smith@ethereal.com',
	PASS: process.env.SMTP_PASS ?? 'bNsdU51CReGg5tyMXS',
} as const;

const trasport = nodemailer.createTransport({
	host: ETHEREAL.HOST,
	port: ETHEREAL.PORT,
	secure: false,
	auth: {
		user: ETHEREAL.USER,
		pass: ETHEREAL.PASS,
	},
});

export default trasport;
