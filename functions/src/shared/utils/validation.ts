export const isEmptyString = (value?: string): value is undefined =>
	!value || !value.trim();

export const isNotDate = (value: string) => {
	const date = new Date(value);

	return isNaN(date.getTime());
};

export const isNotEmptyObj = (object: object) =>
	Object.values(object).length > 0;

export function assertIsNotErroneous<
	TFull,
	TPartial extends Partial<TFull>,
	TErrors extends object
>(body: TPartial, errors: TErrors): body is TPartial & TFull {
	if (isNotEmptyObj(errors)) {
		return false;
	}
	return true;
}
