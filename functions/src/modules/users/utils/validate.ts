import {
	assertIsNotErroneous,
	isEmptyString,
	isNotDate,
} from '../../../shared/utils/validation';
import {
	PasswordsData,
	PasswordsDataBody,
	PasswordsDataErrors,
	SignUp,
	SignUpBody,
	SignUpErrors,
	UserInfo,
	UserInfoBody,
	UserInfoErrors
} from '../types/body';

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const urlRegex =
	/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=,]*)$/;

const PASSWORD_MIN_LENGTH = 6;

export const validateSignUpBody = (body: SignUpBody) => {
	const { email } = body;

	const errors: SignUpErrors = validateUserInfo(body);

	if (isEmptyString(email)) {
		errors.email = 'Email is required';
	} else if (!emailRegex.test(email)) {
		errors.email = 'Invalid email is provided';
	}

	const passwordsErrors = validatePasswords(body);

	errors.password = passwordsErrors.password
	errors.confirmPassword = passwordsErrors.confirmPassword;

	return errors;
};

export const validateUserInfo = (body: UserInfoBody) => {
	const { firstName, lastName, avatar, birthday } = body;

	const errors: UserInfoErrors = {};

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

export const validatePasswords = ({password, confirmPassword}: PasswordsDataBody) => {
	const errors: PasswordsDataErrors = {};

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
}

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
