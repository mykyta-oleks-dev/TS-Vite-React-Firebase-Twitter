import { Request, Response, NextFunction, RequestHandler } from 'express';
import { HTTP, HTTP_LABEL } from '../shared/constants/HTTP';

type Payload = Record<string, string | number>;

// Custom error class for better error handling
export class AppError extends Error {
	constructor(
		public message: string,
		public status: number = HTTP.INTERNAL,
		public payload?: Payload,
		public isOperational: boolean = true
	) {
		super(message);
		this.name = this.constructor.name;
		Error.captureStackTrace(this, this.constructor);
	}
}

// Predefined error creators
export class BadRequestError extends AppError {
	constructor(
		message: string = HTTP_LABEL[HTTP.BAD_REQUEST],
		payload?: Payload
	) {
		super(message, HTTP.BAD_REQUEST, payload);
	}
}

export class UnauthorizedError extends AppError {
	constructor(message: string = HTTP_LABEL[HTTP.UNAUTHORIZED]) {
		super(message, HTTP.UNAUTHORIZED);
	}
}

export class ForbiddenError extends AppError {
	constructor(message: string = HTTP_LABEL[HTTP.FORBIDDEN]) {
		super(message, HTTP.FORBIDDEN);
	}
}

export class NotFoundError extends AppError {
	constructor(message: string = HTTP_LABEL[HTTP.NOT_FOUND]) {
		super(message, HTTP.NOT_FOUND);
	}
}

export class ConflictError extends AppError {
	constructor(message: string = HTTP_LABEL[HTTP.CONFLICT]) {
		super(message, HTTP.CONFLICT);
	}
}

// Error response interface
interface ErrorResponse {
	status: 'error' | 'fail';
	message: string;
	stack?: string;
	errors?: unknown;
	payload?: Payload;
}

// Main error handler
export const errorHandler = (
	err: Error | AppError,
	_req: Request,
	res: Response,
	_next: NextFunction
) => {
	// Default values
	let statusCode = 500;
	let message = 'Internal Server Error';
	let isOperational = false;
	let payload: Payload | undefined = undefined;

	// Handle AppError instances
	if (err instanceof AppError) {
		statusCode = err.status;
		message = err.message;
		isOperational = err.isOperational;
		payload = err.payload;
	}

	if (!isOperational || statusCode === 500) {
		console.error('Error:', {
			name: err.name,
			message: err.message,
			status: statusCode,
			stack: err.stack,
			payload: payload,
		});
	}

	// Prepare response
	const response: ErrorResponse = {
		status: statusCode >= 500 ? 'error' : 'fail',
		message,
		payload,
	};

	if (process.env.NODE_ENV !== 'production') {
		response.stack = err.stack;
	}

	// Handle specific error types
	if (err.name === 'ValidationError') {
		statusCode = 400;
		response.message = 'Validation Error';
		response.errors = err;
	}

	if (err.name === 'CastError') {
		statusCode = 400;
		response.message = 'Invalid ID format';
	}

	// JWT errors
	if (err.name === 'JsonWebTokenError') {
		statusCode = 401;
		response.message = 'Invalid token';
	}

	if (err.name === 'TokenExpiredError') {
		statusCode = 401;
		response.message = 'Token expired';
	}

	res.status(statusCode).json(response);
};

// 404 handler for undefined routes
export const notFoundHandler = (
	req: Request,
	_res: Response,
	next: NextFunction
) => {
	next(new NotFoundError(`Route ${req.originalUrl} not found`));
};

// Async handler wrapper to catch errors in async route handlers
export const asyncHandler = (
	fn: RequestHandler
) => {
	return (req: Request, res: Response, next: NextFunction) => {
		Promise.resolve(fn(req, res, next)).catch(next);
	};
};
