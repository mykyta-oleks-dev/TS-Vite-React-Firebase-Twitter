export interface ApiError {
	status: 'error' | 'fail';
	message: string;
	stack?: string;
	errors?: unknown;
	payload?: Record<string, string | number>;
}
