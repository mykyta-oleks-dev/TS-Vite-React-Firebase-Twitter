export const ETHEREAL = {
	HOST: process.env.SMTP_HOST ?? 'smtp.ethereal.email',
	PORT: process.env.SMTP_PORT ? +process.env.SMTP_PORT : 587,
	USER: process.env.SMTP_USER ?? 'john.smith@ethereal.com',
	PASS: process.env.SMTP_PASS ?? 'bNsdU51CReGg5tyMXS',
};
