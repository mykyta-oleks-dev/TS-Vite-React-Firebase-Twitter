import nodemailer from 'nodemailer';
import { ETHEREAL } from '../modules/users/constants/Verification';

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
