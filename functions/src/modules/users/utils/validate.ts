import {
	assertIsNotErroneous,
	isEmptyString,
	isNotDate,
} from '../../../shared/utils/validation';
import {
	emailRegex,
	PASSWORD_MIN_LENGTH,
	urlRegex,
	VALIDATION_ERRORS,
} from '../constants/Errors';
import {
	PasswordsData,
	PasswordsDataBody,
	PasswordsDataErrors,
	SignUp,
	SignUpBody,
	SignUpErrors,
	UserInfo,
	UserInfoBody,
	UserInfoErrors,
} from '../types/body';

export const validateSignUpBody = (body: SignUpBody) => {
	const errors: SignUpErrors = validateUserInfo(body);

	const emailError = validateEmail(body.email)
	if (emailError) errors.email = emailError;

	const passwordsErrors = validatePasswords(body);
	if (passwordsErrors.password) errors.password = passwordsErrors.password;
	if (passwordsErrors.confirmPassword) errors.confirmPassword = passwordsErrors.confirmPassword;

	return errors;
};

export const validateEmail = (email?: string) => {
	if (isEmptyString(email)) {
		return VALIDATION_ERRORS.EMAIL.REQUIRED;
	} else if (!emailRegex.test(email)) {
		return VALIDATION_ERRORS.EMAIL.INVALID;
	}

	return undefined;
};

export const validateUserInfo = (body: UserInfoBody) => {
	const { firstName, lastName, avatar, birthday } = body;

	const errors: UserInfoErrors = {};

	if (isEmptyString(firstName)) {
		errors.firstName = VALIDATION_ERRORS.FIRST_NAME.REQUIRED;
	}

	if (isEmptyString(lastName)) {
		errors.lastName = VALIDATION_ERRORS.LAST_NAME.REQUIRED;
	}

	if (isEmptyString(avatar)) {
		errors.avatar = VALIDATION_ERRORS.AVATAR.REQUIRED;
	} else if (!urlRegex.test(avatar)) {
		errors.avatar = VALIDATION_ERRORS.AVATAR.INVALID;
	}

	if (isEmptyString(birthday)) {
		errors.birthday = VALIDATION_ERRORS.BIRTHDAY.REQUIRED;
	} else if (isNotDate(birthday)) {
		errors.birthday = VALIDATION_ERRORS.BIRTHDAY.INVALID;
	}

	return errors;
};

export const validatePasswords = ({
	password,
	confirmPassword,
}: PasswordsDataBody) => {
	const errors: PasswordsDataErrors = {};

	if (isEmptyString(password)) {
		errors.password = VALIDATION_ERRORS.PASSWORD.REQUIRED;
	} else if (password.length < PASSWORD_MIN_LENGTH) {
		errors.password = VALIDATION_ERRORS.PASSWORD.INVALID;
	}

	if (isEmptyString(confirmPassword)) {
		errors.confirmPassword = VALIDATION_ERRORS.CONFIRM_PASSWORD.REQUIRED;
	} else if (confirmPassword !== password) {
		errors.confirmPassword = VALIDATION_ERRORS.CONFIRM_PASSWORD.INVALID;
	}

	return errors;
};

export const assertIsSignUp = assertIsNotErroneous<
	SignUp,
	SignUpBody,
	SignUpErrors
>;

export const assertIsUserInfo = assertIsNotErroneous<
	UserInfo,
	UserInfoBody,
	UserInfoErrors
>;

export const assertIsPasswordsData = assertIsNotErroneous<
	PasswordsData,
	PasswordsDataBody,
	PasswordsDataErrors
>;
