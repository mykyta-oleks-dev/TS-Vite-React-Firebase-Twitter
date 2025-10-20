export const VALIDATION = {
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

export const ACCEPTED_IMAGE_TYPES = new Set([
	'image/jpeg',
	'image/jpg',
	'image/png',
	'image/webp',
]);

export const FORM_FIELD = {
	AVATAR: {
		LABEL: 'Avatar',
	},
	FIRST_NAME: {
		PLACEHOLDER: 'Alex',
		LABEL: 'First name',
	},
	LAST_NAME: {
		PLACEHOLDER: 'Johns',
		LABEL: 'Last name',
	},
	ABOUT: {
		PLACEHOLDER: 'Influencer, IT-specialist...',
		LABEL: 'About you',
	},
	LOCATION: {
		PLACEHOLDER: 'New-York City',
		LABEL: 'Your location',
	},
	BIRTHDAY: {
		LABEL: 'Birthday',
	},
	EMAIL: {
		PLACEHOLDER: 'user@mail.com',
		LABEL: 'Email',
	},
	PASSWORD: {
		PLACEHOLDER: '●●●●●●',
		LABEL: 'Password',
	},
	OLD_PASSWORD: {
		LABEL: 'Current password',
	},
	CONFIRM_PASSWORD: {
		LABEL: 'Confirm Password',
	},
} as const;
