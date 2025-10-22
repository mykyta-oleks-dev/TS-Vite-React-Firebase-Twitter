import { Request, RequestHandler } from 'express';
import { getUserOrThrowError } from '../../shared/utils/authentication';
import { PostInfoBody, PostQuery } from './types/body';
import postsService from './posts.service';

class PostsController {
	create: RequestHandler = async (
		req: Request<{}, {}, PostInfoBody>,
		res
	) => {
		const user = getUserOrThrowError(req);

		const body = req.body;

		const { id } = await postsService.create(user, body);

		res.status(201).json({
			message: 'Successfuly created a post!',
			postId: id,
		});
	};

	getOne: RequestHandler = async (req: Request<{ id?: string }>, res) => {
		const { id } = req.params;

		const { post } = await postsService.getOne(id);

		res.status(200).json({ message: 'Post fetched successfuly!', post });
	};

	getMany: RequestHandler = async (
		req: Request<{}, {}, {}, PostQuery>,
		res
	) => {
		const query = req.query;

		const { posts, pages, total } = await postsService.getMany(query);

		res.status(200).json({ message: 'Posts fetched succesfuly!', posts, pages, total });
	};
}

const postsController = new PostsController();

export default postsController;
