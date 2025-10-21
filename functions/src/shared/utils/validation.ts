import { SHARED_VALIDATION_ERRORS } from "../constants/Errors";

export const validateQuery = ({page, limit}: { page?: string, limit?: string}) => {
	const errors: Partial<Record<'page' | 'limit', string | undefined>> = {};

	if (page && isNotInteger(page)) {
		errors.page = SHARED_VALIDATION_ERRORS.PAGE.INVALID;
	}

	if (limit && isNotInteger(limit)) {
		errors.limit = SHARED_VALIDATION_ERRORS.LIMIT.INVALID;
	}

	return errors;
}

export const isEmptyString = (value?: string): value is undefined =>
	!value?.trim();

export const isNotDate = (value: string) => {
	const date = new Date(value);

	return Number.isNaN(date.getTime());
};

export const isNotInteger = (value: string) => Number.isNaN(Number.parseInt(value));

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
