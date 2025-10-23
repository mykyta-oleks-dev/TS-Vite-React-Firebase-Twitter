import { urlRegex } from '../../../shared/constants/Errors';
import { LikeAction, likeActions } from '../../../shared/types/data/Like';
import {
	assertIsNotErroneous,
	isEmptyString,
} from '../../../shared/utils/validation';
import { TITLE_MIN_LENGTH, VALIDATION_ERRORS } from '../constants/Errors';
import { PostInfo, PostInfoBody, PostInfoErrors } from '../types/body';

export const validatePostInfoBody = (body: PostInfoBody) => {
	const { title, content, photo } = body;

	const errors: PostInfoErrors = {};

	if (isEmptyString(title)) {
		errors.title = VALIDATION_ERRORS.TITLE.REQUIRED;
	} else if (title.length < TITLE_MIN_LENGTH) {
		errors.title = VALIDATION_ERRORS.TITLE.INVALID;
	}

	if (isEmptyString(content)) {
		errors.content = VALIDATION_ERRORS.CONTENT.REQUIRED;
	}

	if (photo && !urlRegex.test(photo)) {
		errors.photo = VALIDATION_ERRORS.PHOTO.INVALID;
	}

	return errors;
};

export const assertIsPostInfo = assertIsNotErroneous<
	PostInfo,
	PostInfoBody,
	PostInfoErrors
>;

export function isLikeAction(value?: string): value is LikeAction {
	if (!value) return false;
	return likeActions.includes(value as LikeAction);
}
