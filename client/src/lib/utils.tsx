import { IS_DEV } from '@/constants/env';
import { AxiosError } from 'axios';
import { clsx, type ClassValue } from 'clsx';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';
import { assertIsApiError, assertIsFirebaseError } from './assertions';
import { FirebaseError } from 'firebase/app';
import { AuthErrorCodes } from 'firebase/auth';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

const getFirebaseErrorMessage = (error: FirebaseError) => {
	if (error.code === AuthErrorCodes.INVALID_PASSWORD)
		return 'Wrong current password provided!';

	if (error.code === AuthErrorCodes.INVALID_LOGIN_CREDENTIALS)
		return 'Invalid credentials provided!';

	return error.message;
};

export function getErrorMessage(error: unknown): string {
	if (assertIsFirebaseError(error)) {
		return getFirebaseErrorMessage(error);
	}

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

export function getErrorPayload(error: unknown) {
	if (assertIsApiError(error)) {
		return error.payload;
	}

	return undefined;
}

export function handleError(
	error: unknown,
	showToast?: boolean
): {
	success: false;
	error: string;
} {
	if (error instanceof AxiosError) {
		return handleError(error.response?.data ?? 'API call failed');
	}

	const message = getErrorMessage(error);

	if (IS_DEV) console.error(error);

	if (showToast) {
		const payload = getErrorPayload(error);

		toast.error(message, {
			description: payload ? (
				<ul>
					{Object.entries(payload).map(([key, value]) => (
						<li key={`error-payload.${key}`}>
							{key}: {value}
						</li>
					))}
				</ul>
			) : undefined,
		});
	}

	return {
		success: false,
		error: message,
	};
}
