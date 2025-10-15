import cors from 'cors';
import express, { RequestHandler } from 'express';
import {
	AppError,
	errorHandler,
	notFoundHandler,
} from './middlewares/ErrorHandling';

// Initialize Firebase Admin SDK

// References to Firestore and Auth
// Initialize the Express application
const app = express();

app.use(cors());
app.use(express.json());

// Routes
const helloHandler: RequestHandler = (_req, res) => {
    res.status(200).send('Hello world');
};

const throwTestError: RequestHandler = () => {
    throw new AppError('Test error');
};

app.get('/', helloHandler);
app.get('/error', throwTestError);

// Unknown routes handling
app.use(notFoundHandler);

// Errors handling
app.use(errorHandler);

export default app;
