import { auth } from '../../../config/firebase';
import transport from '../../../config/nodemailer';
import { AppError } from '../../../middlewares/ErrorHandling';
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
						</div>`,
				})
				.catch(() => {
					throw new AppError('Failed to send the verification email');
				});
		})
		.catch((err) => {
			throw err;
		});

export const sendResetPassword = async (email: string, redirectUrl?: string) =>
	auth
		.generatePasswordResetLink(
			email,
			redirectUrl
				? {
						url: redirectUrl,
						handleCodeInApp: true,
				  }
				: undefined
		)
		.then(async (link) => {
			await transport
				.sendMail({
					from: `"Twitter Clone Automatic Messages" <${ETHEREAL.USER}>`,
					to: email,
					subject: 'Password reset',
					html: /* html */ `
						<div>
							<h4>Proceed through the link below to reset your password.</h4>
							<p>Don't share it with no one!</p>
							<a href="${link}">${link}</a>
							<p>If you did not ask for password reset, please ignore this message</p>
						</div>`,
				})
				.catch(() => {
					throw new AppError(
						'Failed to send the reset password email'
					);
				});
		})
		.catch((err) => {
			throw err;
		});
