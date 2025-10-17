import { IS_DEV } from '@/constants/env';
import { clsx, type ClassValue } from 'clsx';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getErrorMessage(error: unknown): string {
	if (
		typeof error === 'object' &&
		error !== null &&
		'message' in error &&
		typeof error.message === 'string'
	) {
		return error.message;
	}

	if (typeof error === 'string') return error;

	return 'An unexpected error!';
}

export function handleError(
	error: unknown,
	showToast?: boolean
): {
	success: false;
	error: string;
} {
	const message = getErrorMessage(error);

	if (IS_DEV) console.error(error);

	if (showToast) toast.error(message);

	return {
		success: false,
		error: message,
	};
}
