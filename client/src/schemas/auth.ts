import { ACCEPTED_IMAGE_TYPES, VALIDATION } from '@/constants/auth';
import { z } from 'zod';

export const userInfoSchema = z.object({
	firstName: z.string(VALIDATION.FIRST_NAME.REQUIRED),
	lastName: z.string(VALIDATION.LAST_NAME.REQUIRED),
	about: z.string().optional(),
	location: z.string().optional(),
	birthday: z.date(VALIDATION.BIRTHDAY.REQUIRED),
});

export type userInfoData = z.infer<typeof userInfoSchema>;

export const avatarRequiredSchema = z.object({
	avatar: z
		.instanceof(File)
		.nonoptional(VALIDATION.AVATAR.REQUIRED)
		.refine(
			(file) => ACCEPTED_IMAGE_TYPES.has(file.type),
			VALIDATION.AVATAR.WRONG_FORMAT
		),
});

export type avatarRequiredData = z.infer<typeof avatarRequiredSchema>;

export const avatarOptionalSchema = z.object({
	avatar: z
		.instanceof(File)
		.optional()
		.refine((file) => {
			if (!file) return true;
			if (ACCEPTED_IMAGE_TYPES.has(file.type)) return true;
			return false;
		}, VALIDATION.AVATAR.WRONG_FORMAT),
});

export type avatarOptionalData = z.infer<typeof avatarOptionalSchema>;

export const logInSchema = z.object({
	email: z.email(VALIDATION.EMAIL.REQUIRED),
	password: z
		.string(VALIDATION.PASSWORD.REQUIRED)
		.min(VALIDATION.PASSWORD.MIN.VALUE, VALIDATION.PASSWORD.MIN.MESSAGE),
});

export type logInData = z.infer<typeof logInSchema>;

export const signUpSchema = logInSchema
	.extend(userInfoSchema.shape)
	.extend(avatarRequiredSchema.shape)
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
				message: VALIDATION.CONFIRM_PASSWORD.DONT_MATCH,
				path: ['confirmPassword'],
			});
		}
	});

export type signUpData = z.infer<typeof signUpSchema>;

export const signUpFinishSchema = userInfoSchema.extend(
	avatarRequiredSchema.shape
);

export type signUpFinishData = z.infer<typeof signUpFinishSchema>;

export const changePasswordSchema = z
	.object({
		oldPassword: z
			.string(VALIDATION.PASSWORD.REQUIRED)
			.min(
				VALIDATION.PASSWORD.MIN.VALUE,
				VALIDATION.PASSWORD.MIN.MESSAGE
			),
		password: z
			.string(VALIDATION.PASSWORD.REQUIRED)
			.min(
				VALIDATION.PASSWORD.MIN.VALUE,
				VALIDATION.PASSWORD.MIN.MESSAGE
			),
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
				message: VALIDATION.CONFIRM_PASSWORD.DONT_MATCH,
				path: ['confirmPassword'],
			});
		}
	});

export type changePasswordData = z.infer<typeof changePasswordSchema>;

export const editProfileSchema = userInfoSchema.extend(
	avatarOptionalSchema.shape
);

export type editProfileData = z.infer<typeof editProfileSchema>;
