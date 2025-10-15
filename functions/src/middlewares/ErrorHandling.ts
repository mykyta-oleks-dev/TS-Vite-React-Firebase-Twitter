import { Request, Response, NextFunction } from 'express';

// Custom error class for better error handling
export class AppError extends Error {
	constructor(
		public message: string,
		public status: number = 500,
		public isOperational: boolean = true
	) {
		super(message);
		this.name = this.constructor.name;
		Error.captureStackTrace(this, this.constructor);
	}
}

// Predefined error creators
export class BadRequestError extends AppError {
	constructor(message: string = 'Bad Request') {
		super(message, 400);
	}
}

export class UnauthorizedError extends AppError {
	constructor(message: string = 'Unauthorized') {
		super(message, 401);
	}
}

export class ForbiddenError extends AppError {
	constructor(message: string = 'Forbidden') {
		super(message, 403);
	}
}

export class NotFoundError extends AppError {
	constructor(message: string = 'Resource not found') {
		super(message, 404);
	}
}

export class ConflictError extends AppError {
	constructor(message: string = 'Conflict') {
		super(message, 409);
	}
}

// Error response interface
interface ErrorResponse {
	status: 'error' | 'fail';
	message: string;
	stack?: string;
	errors?: unknown;
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

	// Handle AppError instances
	if (err instanceof AppError) {
		statusCode = err.status;
		message = err.message;
		isOperational = err.isOperational;
	}

	if (!isOperational || statusCode === 500) {
		console.error('Error:', {
			name: err.name,
			message: err.message,
			status: statusCode,
			stack: err.stack,
		});
	}

	// Prepare response
	const response: ErrorResponse = {
		status: statusCode >= 500 ? 'error' : 'fail',
		message,
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
	fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) => {
	return (req: Request, res: Response, next: NextFunction) => {
		Promise.resolve(fn(req, res, next)).catch(next);
	};
};
