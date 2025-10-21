export const POSTS_VALIDATION = {
	TITLE: {
		REQUIRED: 'Title is required',
		MIN: {
			VALUE: 3,
			MESSAGE: 'Title has to be at least 3 characters',
		},
	},
	CONTENT: {
		REQUIRED: 'Content is required',
	},
} as const;

export const POSTS_FORM_FIELDS = {
	PHOTO: {
		TYPE: 'file',
		NAME: 'photo',
		LABEL: 'Photo',
	},
	TITLE: {
		NAME: 'title',
		PLACEHOLDER: 'Succulent Chineese meal...',
		LABEL: 'Title',
	},
	CONTENT: {
		NAME: 'content',
		PLACEHOLDER: 'It is a crime to not have a piece of...',
		LABEL: 'Content',
	},
} as const;
