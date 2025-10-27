import { DecodedIdToken } from 'firebase-admin/auth';
import { auth } from '../../config/firebase';
import { BadRequestError } from '../../middlewares/ErrorHandling';
import { SHARED_REQ_ERRORS } from '../../shared/constants/Errors';
import { isNotEmptyObj, validateQuery } from '../../shared/utils/validation';
import { COMMENT_VALIDATION_ERRORS, REQUEST_ERRORS } from './constants/Errors';
import postsRepository from './posts.repository';
import { CommentInfoBody } from './types/commentBody';
import { PostInfoBody, PostQuery } from './types/postBody';
import {
	assertIsCommentInfo,
	assertIsPostInfo,
	isLikeAction,
	validatePostInfoBody,
} from './utils/validate';

class PostsService {
	private readonly _getIdOrThrow = (id?: string, isComment = false) => {
		if (!id) {
			if (isComment) {
				throw new BadRequestError(
					REQUEST_ERRORS.BAD_REQUEST_NO_COMM_ID
				);
			}
			throw new BadRequestError(REQUEST_ERRORS.BAD_REQUEST_NO_POST_ID);
		}
		return id;
	};

	create = async (user: DecodedIdToken, body: PostInfoBody) => {
		const errors = validatePostInfoBody(body);

		if (!assertIsPostInfo(body, errors)) {
			throw new BadRequestError(
				REQUEST_ERRORS.BAD_REQUEST_POST_WRITE,
				errors
			);
		}

		const userRecord = await auth.getUser(user.uid);

		return postsRepository.create(userRecord, body);
	};

	getOne = async (
		id?: string,
		user?: DecodedIdToken,
		withComments?: boolean
	) => {
		const postId = this._getIdOrThrow(id);

		return postsRepository.getOne(postId, user, withComments);
	};

	getMany = async (query: PostQuery, user?: DecodedIdToken) => {
		const errors = validateQuery(query);

		if (isNotEmptyObj(errors)) {
			throw new BadRequestError(
				SHARED_REQ_ERRORS.BADREQUEST_QUERY,
				errors
			);
		}

		const { page, limit } = query;

		const pageParsed = page ? Number.parseInt(page) : undefined;
		const limitParsed = limit ? Number.parseInt(limit) : undefined;

		return postsRepository.getMany(
			pageParsed,
			limitParsed,
			user,
			query.userId,
			query.search,
			query.sort
		);
	};

	update = async (body: PostInfoBody, id?: string) => {
		const postId = this._getIdOrThrow(id);

		const errors = validatePostInfoBody(body);

		if (!assertIsPostInfo(body, errors)) {
			throw new BadRequestError(
				REQUEST_ERRORS.BAD_REQUEST_POST_WRITE,
				errors
			);
		}

		return postsRepository.update(postId, body);
	};

	delete = async (id?: string) => {
		const postId = this._getIdOrThrow(id);

		await postsRepository.delete(postId);
	};

	// Likes validation

	like = async (user: DecodedIdToken, id?: string, type?: string) => {
		const postId = this._getIdOrThrow(id);

		if (!isLikeAction(type)) {
			throw new BadRequestError(REQUEST_ERRORS.BAD_REQUEST_LIKE_TYPE);
		}

		await postsRepository.like(user, postId, type);
	};

	removeLike = async (user: DecodedIdToken, id?: string) => {
		const postId = this._getIdOrThrow(id);

		await postsRepository.removeLike(user, postId);
	};

	// Comments validation
	createComment = async (
		user: DecodedIdToken,
		body: CommentInfoBody,
		id?: string
	) => {
		const postId = this._getIdOrThrow(id);

		if (!assertIsCommentInfo(body)) {
			throw new BadRequestError(
				REQUEST_ERRORS.BAD_REQUEST_COMMENT_WRITE,
				{
					comment: COMMENT_VALIDATION_ERRORS.TEXT.REQUIRED,
				}
			);
		}

		return postsRepository.createComment(user, postId, body);
	};

	updateComment = async (
		body: CommentInfoBody,
		postId?: string,
		commentId?: string
	) => {
		const postIdActual = this._getIdOrThrow(postId);
		const commentIdActual = this._getIdOrThrow(commentId, true);

		if (!assertIsCommentInfo(body)) {
			throw new BadRequestError(
				REQUEST_ERRORS.BAD_REQUEST_COMMENT_WRITE,
				{
					comment: COMMENT_VALIDATION_ERRORS.TEXT.REQUIRED,
				}
			);
		}

		return postsRepository.updateComment(postIdActual, commentIdActual, body);
	};
}

const postsService = new PostsService();

export default postsService;
