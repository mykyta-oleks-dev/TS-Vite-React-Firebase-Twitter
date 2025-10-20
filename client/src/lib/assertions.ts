import type { ApiError } from '@/types/ApiError';

export const assertIsApiError = (error: unknown): error is ApiError =>
	typeof error === 'object' &&
	error !== null &&
	'status' in error &&
	'message' in error;
