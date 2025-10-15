import { NextFunction, Request, Response } from 'express';
import { auth } from '../config/firebase';
import { UnauthorizedError } from './ErrorHandling';

const authenticate = async (
	req: Request,
	_res: Response,
	next: NextFunction
) => {
	const idToken = req.headers.authorization?.split('Bearer ')[1];

	if (!idToken) {
		throw new UnauthorizedError('Unauthorized: No token provided');
	}

	try {
		const decodedToken = await auth.verifyIdToken(idToken);
		req.user = decodedToken;
		next();
	} catch (error) {
		if (process.env.NODE_ENV !== 'production') {
			console.error('Auth Error:', error);
		}
		throw new UnauthorizedError('Unauthorized: Invalid token');
	}
};

export default authenticate;
