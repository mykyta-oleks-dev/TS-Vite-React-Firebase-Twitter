import cors from 'cors';
import express, { RequestHandler } from 'express';
import { errorHandler, notFoundHandler } from './middlewares/ErrorHandling.js';
import { postsRoutes, usersRoutes } from './modules/index.js';

// Initialize the Express application
const app = express();

app.use(cors());
app.use(express.json());

// Routes
const helloHandler: RequestHandler = (_req, res) => {
	res.status(200).send('Hello world');
};

app.get('/', helloHandler);
app.get('/api/', helloHandler);
app.use('/api/users', usersRoutes);
app.use('/api/posts', postsRoutes);

// Unknown routes handling
app.use(notFoundHandler);

// Errors handling
app.use(errorHandler);

export default app;
