import { NextFunction, Request, Response } from 'express';
import {
	AppError,
	BadRequestError,
	ForbiddenError,
	NotFoundError,
} from './ErrorHandling.js';
import { db } from '../config/firebase.js';
import { DocumentReference } from 'firebase-admin/firestore';

/**
 * Ensures the authenticated user is the author of the Firestore document.
 * Assumes the document has a field named 'userId' matching the user's UID.
 * * @param collectionName The name of the Firestore collection (e.g., 'posts').
 * @param idParamName The name of the URL parameter that holds the document ID (e.g., 'postId').
 */
const isAuthor = (collectionNames: string[], idParamNames: string[]) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		// Is user is authenticated (req.user must be present)
		if (!req.user?.uid) {
			throw new ForbiddenError('Forbidden: Authentication required.');
		}

		const userId = req.user.uid;

		const docIds: string[] = [];

		for (const idParamName of idParamNames) {
			docIds.push(req.params[idParamName]);
		}

		if (!docIds.length) {
			throw new BadRequestError('Bad Request: Document ID/IDs missing.');
		}

		// Get the document from Firestore
		let docRef: DocumentReference | undefined;
		for (let i = 0; i < docIds.length; i++) {
			docRef = (docRef ?? db)
				.collection(collectionNames[i])
				.doc(docIds[i]);
		}

		if (!docRef) {
			throw new AppError('DEV: docRef is not initialized, check arrays validity')
		}
		
		const doc = await docRef.get();

		if (!doc.exists) {
			throw new NotFoundError('Resource not found.');
		}

		const data = doc.data();

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
