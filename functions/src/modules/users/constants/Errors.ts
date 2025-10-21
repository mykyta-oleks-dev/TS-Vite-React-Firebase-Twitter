export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const PASSWORD_MIN_LENGTH = 6;

export const REQUEST_ERRORS = {
	BADREQUEST_SIGNUP: 'Data provided for sign up is invalid',
	BADREQUEST_UPDATE: 'Data provided for update is invalid',
	BADREQUEST_RESETPSW: 'Passwords data provided for reset is invalid',
	BADREQUEST_NOEMAIL: 'User has no email coupled to their record',
	BADREQUEST_NOUID: 'UID is not provided',
	
	CREATE_ERROR: 'Error creating user record',
	UPDATE_ERROR: 'Error updating user record',
	FIND_ERROR: 'Error finding user record',
	ALREADY_VERIFIED: 'User is already verified',
	
	NOTFOUND_ONE: 'User data document is not found',
	NOTFOUND_MANY: 'Users data documents are not found',
} as const;

export const VALIDATION_ERRORS = {
	EMAIL: {
		REQUIRED: 'Email is required',
		INVALID: 'Invalid email is provided',
	},
	FIRST_NAME: {
		REQUIRED: 'First name is required',
	},
	LAST_NAME: {
		REQUIRED: 'Last name is required',
	},
	AVATAR: {
		REQUIRED: 'Avatar is required',
		INVALID: 'Avatar attribute has to be a valid URL',
	},
	BIRTHDAY: {
		REQUIRED: 'Birthday is required',
		INVALID: 'Birthday has to be a valid Datetime string',
	},
	PASSWORD: {
		REQUIRED: 'Password is required',
		INVALID: `Password has to be at least ${PASSWORD_MIN_LENGTH} characters long`,
	},
	CONFIRM_PASSWORD: {
		REQUIRED: 'Password confirmation is required',
		INVALID: "Passwords don't match",
	},
} as const;
