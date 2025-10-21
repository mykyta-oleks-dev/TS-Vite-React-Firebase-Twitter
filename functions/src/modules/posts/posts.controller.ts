import { Request, RequestHandler } from 'express';
import { getUserOrThrowError } from '../../shared/utils/authentication';
import { PostInfoBody } from './types/body';
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
}

const postsController = new PostsController();

export default postsController;
