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

	if (error.code === AuthErrorCodes.USER_DELETED)
		return 'User by these credentials is not found';

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
		return handleError(
			error.response?.data ?? 'API call failed',
			showToast
		);
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

export function formatLargeNumber(num?: number, decimals: number = 2): string {
	if (!num || num === 0) return '0';
	if (Math.abs(num) < 1000) return num.toString();

	const tiers = [
		{ value: 1e9, symbol: 'B' }, // Billions
		{ value: 1e6, symbol: 'M' }, // Millions
		{ value: 1e3, symbol: 'K' }, // Thousands
	];

	const tier = tiers.find((t) => Math.abs(num) >= t.value);

	if (tier) {
		const formattedNum = num / tier.value;

		const roundedNum = formattedNum.toFixed(decimals);

		const cleanNum = roundedNum.endsWith(`.${'0'.repeat(decimals)}`)
			? roundedNum.slice(0, -(decimals + 1))
			: roundedNum;

		return cleanNum + tier.symbol;
	}

	return num.toString();
}
