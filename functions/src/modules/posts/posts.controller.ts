import { Request, RequestHandler } from 'express';
import { getUserOrThrowError } from '../../shared/utils/authentication';
import { PostInfoBody, PostQuery } from './types/body';
import postsService from './posts.service';
import { HTTP } from '../../shared/constants/HTTP';
import { LikeAction } from '../../shared/types/data/Like';

class PostsController {
	create: RequestHandler = async (
		req: Request<{}, {}, PostInfoBody>,
		res
	) => {
		const user = getUserOrThrowError(req);

		const body = req.body;

		const { id } = await postsService.create(user, body);

		res.status(HTTP.CREATED).json({
			message: 'Successfuly created a post!',
			postId: id,
		});
	};

	getOne: RequestHandler = async (req: Request<{ id?: string }>, res) => {
		const { id } = req.params;

		const { post } = await postsService.getOne(id);

		res.status(HTTP.OK).json({
			message: 'Post fetched successfuly!',
			post,
		});
	};

	getMany: RequestHandler = async (
		req: Request<{}, {}, {}, PostQuery>,
		res
	) => {
		const query = req.query;

		const { posts, pages, total } = await postsService.getMany(query);

		res.status(HTTP.OK).json({
			message: 'Posts fetched succesfuly!',
			posts,
			pages,
			total,
		});
	};

	update: RequestHandler = async (
		req: Request<{ id?: string }, {}, PostInfoBody>,
		res
	) => {
		const { id } = req.params;

		const body = req.body;

		await postsService.update(body, id);

		res.status(HTTP.OK).json({
			message: 'Successfuly updated a post!',
			postId: id,
		});
	};

	delete: RequestHandler = async (req: Request<{ id?: string }>, res) => {
		const { id } = req.params;

		await postsService.delete(id);

		res.status(HTTP.NO_CONTENT).send();
	};

	like: RequestHandler = async (
		req: Request<{ id?: string }, {}, { type?: LikeAction }>,
		res
	) => {
		const user = getUserOrThrowError(req);
		const { id } = req.params;
		const { type } = req.body;

		await postsService.like(user, id, type);

		res.status(HTTP.NO_CONTENT).send();
	};

	removeLike: RequestHandler = async (
		req: Request<{ id?: string }>,
		res
	) => {
		const user = getUserOrThrowError(req);
		const { id } = req.params;

		await postsService.removeLike(user, id);

		res.status(HTTP.NO_CONTENT).send();
	}
}

const postsController = new PostsController();

export default postsController;
