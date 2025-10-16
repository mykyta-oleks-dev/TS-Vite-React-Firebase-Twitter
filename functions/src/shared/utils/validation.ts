export const isEmptyString = (value?: string): value is undefined =>
	!value || !value.trim();

export const isNotDate = (value: string) => {
	const date = new Date(value);

	return isNaN(date.getTime());
};

export const isNotEmptyObj = (object: object) =>
	Object.values(object).length > 0;
