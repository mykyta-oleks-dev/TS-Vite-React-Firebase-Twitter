import { VALIDATION } from '@/constants/auth';
import { z } from 'zod';

export const signInSchema = z.object({
	email: z.email(VALIDATION.EMAIL.REQUIRED),
	password: z
		.string(VALIDATION.PASSWORD.REQUIRED)
		.min(VALIDATION.PASSWORD.MIN.VALUE, VALIDATION.PASSWORD.MIN.MESSAGE),
});

export type signInData = z.infer<typeof signInSchema>;

export const signUpSchema = signInSchema
	.extend({
		firstName: z.string(VALIDATION.FIRST_NAME.REQUIRED),
		lastName: z.string(VALIDATION.LAST_NAME.REQUIRED),
		confirmPassword: z
			.string(VALIDATION.CONFIRM_PASSWORD.REQUIRED)
			.min(
				VALIDATION.PASSWORD.MIN.VALUE,
				VALIDATION.PASSWORD.MIN.MESSAGE
			),
	})
	.superRefine((val, ctx) => {
		if (val.password !== val.confirmPassword) {
			ctx.addIssue({
				code: 'custom',
				message: "Passwords don't match",
				path: ['confirmPassword'],
			});
		}
	});

export type signUpData = z.infer<typeof signUpSchema>;
