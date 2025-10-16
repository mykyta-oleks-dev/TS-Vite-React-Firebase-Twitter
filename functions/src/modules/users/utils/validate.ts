import { Stringified } from '../../../shared/types/data/common';
import { isEmptyString, isNotDate } from '../../../shared/utils/validation';
import { SignUpBody, UserInfoBody } from '../types/body';

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const urlRegex =
	/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=,]*)$/;

const PASSWORD_MIN_LENGTH = 6;

export const validateSignUpData = (body: SignUpBody) => {
	const { email, password, confirmPassword } = body;

	const errors: Partial<Stringified<SignUpBody>> = validateUserInfo(body);

	if (isEmptyString(email)) {
		errors.email = 'Email is required';
	} else if (!emailRegex.test(email)) {
		errors.email = 'Invalid email is provided';
	}

	if (isEmptyString(password)) {
		errors.password = 'Password is required';
	} else if (password.length < PASSWORD_MIN_LENGTH) {
		errors.password = `Password has to be at least ${PASSWORD_MIN_LENGTH} characters long`;
	}

	if (isEmptyString(confirmPassword)) {
		errors.confirmPassword = 'Password confirmation is required';
	} else if (confirmPassword !== password) {
		errors.confirmPassword = "Passwords don't match";
	}

	return errors;
};

export const validateUserInfo = (body: UserInfoBody) => {
	const { firstName, lastName, avatar, birthday } = body;

	const errors: Partial<Stringified<UserInfoBody>> = {};

	if (isEmptyString(firstName)) {
		errors.firstName = 'First name is required';
	}

	if (isEmptyString(lastName)) {
		errors.lastName = 'Last name is required';
	}

	if (isEmptyString(avatar)) {
		errors.avatar = 'Avatar is required';
	} else if (!urlRegex.test(avatar)) {
		errors.avatar = 'Avatar attribute has to be a valid URL';
	}

	if (isEmptyString(birthday)) {
		errors.birthday = 'Birthday is required';
	} else if (isNotDate(birthday)) {
		errors.birthday = 'Birthday has to be a valid Datetime string';
	}

	return errors;
};
