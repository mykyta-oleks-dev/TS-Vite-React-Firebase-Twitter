export const AUTH_VALIDATION = {
	EMAIL: {
		REQUIRED: 'A valid email is required',
	},
	PASSWORD: {
		REQUIRED: 'A password is required',
		MIN: {
			VALUE: 6,
			MESSAGE: 'Password has to be at least 6 characters',
		},
	},
	CONFIRM_PASSWORD: {
		REQUIRED: 'A password confirmation is required',
		DONT_MATCH: "Passwords don't match",
	},
	FIRST_NAME: {
		REQUIRED: 'First name is required',
	},
	LAST_NAME: {
		REQUIRED: 'Last name is required',
	},
	AVATAR: {
		REQUIRED: 'Avatar is required',
	},
	BIRTHDAY: {
		REQUIRED: 'Birthday date is required',
	},
} as const;

export const AUTH_FORM_FIELDS = {
	AVATAR: {
		TYPE: 'file',
		NAME: 'avatar',
		LABEL: 'Avatar',
	},
	FIRST_NAME: {
		NAME: 'firstName',
		PLACEHOLDER: 'Alex',
		LABEL: 'First name',
	},
	LAST_NAME: {
		NAME: 'lastName',
		PLACEHOLDER: 'Johns',
		LABEL: 'Last name',
	},
	ABOUT: {
		NAME: 'about',
		PLACEHOLDER: 'Influencer, IT-specialist...',
		LABEL: 'About you',
	},
	LOCATION: {
		NAME: 'location',
		PLACEHOLDER: 'New-York City',
		LABEL: 'Your location',
	},
	BIRTHDAY: {
		NAME: 'birthday',
		LABEL: 'Birthday',
	},
	EMAIL: {
		NAME: 'email',
		PLACEHOLDER: 'user@mail.com',
		LABEL: 'Email',
	},
	PASSWORD: {
		NAME: 'password',
		TYPE: 'password',
		PLACEHOLDER: '●●●●●●',
		LABEL: 'Password',
	},
	OLD_PASSWORD: {
		NAME: 'oldPassword',
		LABEL: 'Current password',
	},
	CONFIRM_PASSWORD: {
		NAME: 'confirmPassword',
		LABEL: 'Confirm Password',
	},
} as const;
