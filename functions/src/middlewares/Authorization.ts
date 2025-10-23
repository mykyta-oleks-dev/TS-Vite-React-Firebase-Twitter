import { NextFunction, Request, Response } from 'express';
import {
	BadRequestError,
	ForbiddenError,
	NotFoundError,
} from './ErrorHandling';
import { db } from '../config/firebase';

/**
 * Ensures the authenticated user is the author of the Firestore document.
 * Assumes the document has a field named 'userId' matching the user's UID.
 * * @param collectionName The name of the Firestore collection (e.g., 'posts').
 * @param idParamName The name of the URL parameter that holds the document ID (e.g., 'postId').
 */
const isAuthor = (collectionName: string, idParamName: string) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		// Is user is authenticated (req.user must be present)
		if (!req.user?.uid) {
			throw new ForbiddenError('Forbidden: Authentication required.');
		}

		const docId = req.params[idParamName];
		const userId = req.user.uid;

		if (!docId) {
			throw new BadRequestError('Bad Request: Document ID missing.');
		}

		// Get the document from Firestore
		const doc = await db.collection(collectionName).doc(docId).get();

		if (!doc.exists) {
			throw new NotFoundError('Resource not found.');
		}

		const data = doc.data();

		console.log(data);

		// Authorization Check
		if (data && data.userId === userId) {
			next();
		} else {
			throw new ForbiddenError(
				'Forbidden: You are not the author of this data.'
			);
		}
	};
};

export default isAuthor;
