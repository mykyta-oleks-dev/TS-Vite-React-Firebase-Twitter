import {
	ACCEPTED_IMAGE_TYPES,
	VALIDATION_WRONG_FORMAT,
} from '@/constants/validation/common';
import { POSTS_VALIDATION } from '@/constants/validation/posts';
import z from 'zod';

export const postSchema = z.object({
	title: z
		.string(POSTS_VALIDATION.TITLE.REQUIRED)
		.min(
			POSTS_VALIDATION.TITLE.MIN.VALUE,
			POSTS_VALIDATION.TITLE.MIN.MESSAGE
		),
	content: z.string(POSTS_VALIDATION.CONTENT.REQUIRED),
	photo: z
		.instanceof(File)
		.optional()
		.refine((file) => {
			if (!file) return true;
			if (ACCEPTED_IMAGE_TYPES.has(file.type)) return true;
			return false;
		}, VALIDATION_WRONG_FORMAT),
});

export type postData = z.infer<typeof postSchema>;
