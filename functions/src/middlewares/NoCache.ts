import { NextFunction, Request, Response } from 'express';

const noCaching = async (_req: Request, res: Response, next: NextFunction) => {
	res.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');
	res.set('Expires', '0');
	res.set('Pragma', 'no-cache');
	next();
};

export default noCaching;
