import { ACCEPTED_IMAGE_TYPES, VALIDATION } from '@/constants/auth';
import { z } from 'zod';

export const userInfoSchema = z.object({
	firstName: z.string(VALIDATION.FIRST_NAME.REQUIRED),
	lastName: z.string(VALIDATION.LAST_NAME.REQUIRED),
	about: z.string().optional(),
	location: z.string().optional(),
	avatar: z
		.instanceof(File)
		.nonoptional(VALIDATION.AVATAR.REQUIRED)
		.refine(
			(file) => ACCEPTED_IMAGE_TYPES.has(file.type),
			'Only .jpg, .jpeg, .png and .webp formats are supported.'
		),
	birthday: z.date(VALIDATION.BIRTHDAY.REQUIRED),
});

export type userInfoData = z.infer<typeof userInfoSchema>;

export const logInSchema = z.object({
	email: z.email(VALIDATION.EMAIL.REQUIRED),
	password: z
		.string(VALIDATION.PASSWORD.REQUIRED)
		.min(VALIDATION.PASSWORD.MIN.VALUE, VALIDATION.PASSWORD.MIN.MESSAGE),
});

export type logInData = z.infer<typeof logInSchema>;

export const signUpSchema = logInSchema
	.extend(userInfoSchema.shape)
	.extend({
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
