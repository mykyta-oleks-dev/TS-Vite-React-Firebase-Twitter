export const VALIDATION = {
	EMAIL: {
		REQUIRED: 'A valid email is required',
	},
	PASSWORD: {
		REQUIRED: 'A password is required',
		MIN: {
			VALUE: 6,
			MESSAGE: 'Password has to be at least 6 characters'
		}
	},
	CONFIRM_PASSWORD: {
		REQUIRED: 'A password confirmation is required',
	},
	FIRST_NAME: {
		REQUIRED: 'First name is required'
	},
	LAST_NAME: {
		REQUIRED: 'Last name is required'
	},
};

export const FORM_FIELD = {
	EMAIL: {
		PLACEHOLDER: 'user@mail.com',
		LABEL: 'Email'
	},
	PASSWORD: {
		PLACEHOLDER: '●●●●●●',
		LABEL: 'Password'
	},
	CONFIRM_PASSWORD: {
		LABEL: 'Confirm Password'
	},
}
