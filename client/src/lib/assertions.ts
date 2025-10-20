import type { ApiError } from '@/types/ApiError';
import type { FirebaseError } from 'firebase/app';

export const assertIsApiError = (error: unknown): error is ApiError =>
	typeof error === 'object' &&
	error !== null &&
	'status' in error &&
	'message' in error;

export const assertIsFirebaseError = (error: unknown): error is FirebaseError =>
	typeof error === 'object' &&
	error !== null &&
	'code' in error &&
	typeof (error as { code: unknown }).code === 'string';
