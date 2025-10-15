import { DecodedIdToken } from 'firebase-admin/auth';

// Extend the Express Request interface
declare global {
	namespace Express {
		// Merge the extended properties into the default Request interface
		interface Request {
			// The user property is optional and, if present, is the decoded Firebase ID token
			user?: DecodedIdToken;
		}
	}
}

// NOTE: This file only needs to define the custom type and does not contain any executable code.
// The `DecodedIdToken` type comes from `firebase-admin/auth`.
