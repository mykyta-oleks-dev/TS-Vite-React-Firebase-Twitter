import { Request, RequestHandler } from 'express';
import { getUserOrThrowError } from '../../shared/utils/authentication.js';
import { PostInfoBody, PostQuery } from './types/postBody.js';
import postsService from './posts.service.js';
import { HTTP } from '../../shared/constants/HTTP.js';
import { LikeAction } from '../../shared/types/data/Like.js';
import { CommentInfoBody } from './types/commentBody.js';
import { RESPONSES } from './constants/Responses.js';
import { CommentParams, PostParams } from './types/params.js';

class PostsController {
	create: RequestHandler = async (
		req: Request<
			Record<string, string>,
			Record<string, string>,
			PostInfoBody
		>,
		res
	) => {
		const user = getUserOrThrowError(req);

		const body = req.body;

		const { id } = await postsService.create(user, body);

		res.status(HTTP.CREATED).json({
			message: RESPONSES.POST.CREATE,
			postId: id,
		});
	};

	getOne: RequestHandler = async (req: Request<PostParams>, res) => {
		const { id } = req.params;
		const user = req.user;
		const withComments = req.query.withComments === 'true';

		const { post, userLike, comments } = await postsService.getOne(
			id,
			user,
			withComments
		);

		res.status(HTTP.OK).json({
			message: RESPONSES.POST.GET_ONE,
			post,
			userLike,
			comments,
		});
	};

	getMany: RequestHandler = async (
		req: Request<
			Record<string, string>,
			Record<string, string>,
			Record<string, string>,
			PostQuery
		>,
		res
	) => {
		const query = req.query;
		const user = req.user;

		const { posts, pages, total, userLikes } = await postsService.getMany(
			query,
			user
		);

		res.status(HTTP.OK).json({
			message: RESPONSES.POST.GET_MANY,
			posts,
			pages,
			total,
			userLikes,
		});
	};

	update: RequestHandler = async (
		req: Request<PostParams, Record<string, string>, PostInfoBody>,
		res
	) => {
		const { id } = req.params;

		const body = req.body;

		await postsService.update(body, id);

		res.status(HTTP.OK).json({
			message: RESPONSES.POST.UPDATE,
			postId: id,
		});
	};

	delete: RequestHandler = async (req: Request<PostParams>, res) => {
		const { id } = req.params;

		await postsService.delete(id);

		res.status(HTTP.NO_CONTENT).send();
	};

	// Likes handling

	like: RequestHandler = async (
		req: Request<PostParams, Record<string, string>, { type?: LikeAction }>,
		res
	) => {
		const user = getUserOrThrowError(req);
		const { id } = req.params;
		const { type } = req.body;

		await postsService.like(user, id, type);

		res.status(HTTP.NO_CONTENT).send();
	};

	removeLike: RequestHandler = async (req: Request<PostParams>, res) => {
		const user = getUserOrThrowError(req);
		const { id } = req.params;

		await postsService.removeLike(user, id);

		res.status(HTTP.NO_CONTENT).send();
	};

	// Comments handling

	createComment: RequestHandler = async (
		req: Request<PostParams, Record<string, string>, CommentInfoBody>,
		res
	) => {
		const user = getUserOrThrowError(req);
		const { id } = req.params;
		const body = req.body;

		const { comment } = await postsService.createComment(user, body, id);

		res.status(HTTP.CREATED).json({
			message: RESPONSES.COMMENT.CREATE,
			comment,
		});
	};

	updateComment: RequestHandler = async (
		req: Request<CommentParams, Record<string, string>, CommentInfoBody>,
		res
	) => {
		const { id, commentId } = req.params;
		const body = req.body;

		await postsService.updateComment(body, id, commentId);

		res.status(HTTP.NO_CONTENT).send();
	};

	deleteComment: RequestHandler = async (
		req: Request<CommentParams>,
		res
	) => {
		const { id, commentId } = req.params;

		await postsService.deleteComment(id, commentId);

		res.status(HTTP.NO_CONTENT).send();
	};
}

const postsController = new PostsController();

export default postsController;
