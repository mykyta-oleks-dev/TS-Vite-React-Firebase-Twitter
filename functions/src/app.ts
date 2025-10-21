import cors from 'cors';
import express, { RequestHandler } from 'express';
import { errorHandler, notFoundHandler } from './middlewares/ErrorHandling';
import { postsRoutes, usersRoutes } from './modules';

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

app.get('/', helloHandler);
app.use('/users', usersRoutes);
app.use('/posts', postsRoutes);

// Unknown routes handling
app.use(notFoundHandler);

// Errors handling
app.use(errorHandler);

export default app;
