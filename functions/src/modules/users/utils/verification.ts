import { auth } from '../../../config/firebase';
import transport from '../../../config/nodemailer';
import { ETHEREAL } from '../constants/Verification';

export const sendVerificationEmail = async (
	email: string,
	redirectUrl?: string
) =>
	auth
		.generateEmailVerificationLink(
			email,
			redirectUrl
				? {
						url: redirectUrl,
						handleCodeInApp: true,
				  }
				: undefined
		)
		.then(async (link) => {
			// Construct email verification template, embed the link and send
			// using custom SMTP server.
			await transport
				.sendMail({
					from: `"Twitter Clone Automatic Messages" <${ETHEREAL.USER}>`,
					to: email,
					subject: 'Account verification',
					html: /* html */ `
						<div>
							<h4>Congratulations with signing up at Twitter Clone!</h4>
							<p>Please proceed to the next link to verify your account:</p>
							<a href="${link}">${link}</a>
							<p>If you did not register, please ignore this message</p>
						</div
					`,
				})
				.then(console.log, console.error);
			console.log(link);
		})
		.catch((err) => {
			throw err;
		});
