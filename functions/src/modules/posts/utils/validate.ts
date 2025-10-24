import { urlRegex } from '../../../shared/constants/Errors';
import { LikeAction, likeActions } from '../../../shared/types/data/Like';
import {
	assertIsNotErroneous,
	isEmptyString,
} from '../../../shared/utils/validation';
import {
	POST_VALIDATION_ERRORS,
	TITLE_MIN_LENGTH
} from '../constants/Errors';
import {
	CommentInfo,
	CommentInfoBody
} from '../types/commentBody';
import { PostInfo, PostInfoBody, PostInfoErrors } from '../types/postBody';

export const validatePostInfoBody = (body: PostInfoBody) => {
	const { title, content, photo } = body;

	const errors: PostInfoErrors = {};

	if (isEmptyString(title)) {
		errors.title = POST_VALIDATION_ERRORS.TITLE.REQUIRED;
	} else if (title.length < TITLE_MIN_LENGTH) {
		errors.title = POST_VALIDATION_ERRORS.TITLE.INVALID;
	}

	if (isEmptyString(content)) {
		errors.content = POST_VALIDATION_ERRORS.CONTENT.REQUIRED;
	}

	if (photo && !urlRegex.test(photo)) {
		errors.photo = POST_VALIDATION_ERRORS.PHOTO.INVALID;
	}

	return errors;
};

export const assertIsPostInfo = assertIsNotErroneous<
	PostInfo,
	PostInfoBody,
	PostInfoErrors
>;

export const assertIsCommentInfo = (
	body: CommentInfoBody
): body is CommentInfo => !isEmptyString(body.text);

export function isLikeAction(value?: string): value is LikeAction {
	if (!value) return false;
	return likeActions.includes(value as LikeAction);
}
