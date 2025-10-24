import { DecodedIdToken } from 'firebase-admin/auth';
import { auth } from '../../config/firebase';
import { BadRequestError } from '../../middlewares/ErrorHandling';
import { SHARED_REQ_ERRORS } from '../../shared/constants/Errors';
import { isNotEmptyObj, validateQuery } from '../../shared/utils/validation';
import { REQUEST_ERRORS } from './constants/Errors';
import postsRepository from './posts.repository';
import { PostInfoBody, PostQuery } from './types/body';
import { assertIsPostInfo, isLikeAction, validatePostInfoBody } from './utils/validate';

class PostsService {
	create = async (user: DecodedIdToken, body: PostInfoBody) => {
		const errors = validatePostInfoBody(body);

		if (!assertIsPostInfo(body, errors)) {
			throw new BadRequestError(REQUEST_ERRORS.BADREQUEST_WRITE, errors);
		}

		const userRecord = await auth.getUser(user.uid);

		return postsRepository.create(userRecord, body);
	};

	getOne = async (id?: string) => {
		if (!id) throw new BadRequestError(REQUEST_ERRORS.BADREQUEST_NOID);

		return postsRepository.getOne(id);
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
			query.sort,
		);
	};

	update = async (body: PostInfoBody, id?: string) => {
		if (!id) throw new BadRequestError(REQUEST_ERRORS.BADREQUEST_NOID);

		const errors = validatePostInfoBody(body);

		if (!assertIsPostInfo(body, errors)) {
			throw new BadRequestError(REQUEST_ERRORS.BADREQUEST_WRITE, errors);
		}

		return postsRepository.update(id, body);
	};

	delete = async (id?: string) => {
		if (!id) throw new BadRequestError(REQUEST_ERRORS.BADREQUEST_NOID);

		await postsRepository.delete(id);
	};

	like = async (user: DecodedIdToken, id?: string, type?: string) => {
		if (!id) throw new BadRequestError(REQUEST_ERRORS.BADREQUEST_NOID);

		if (!isLikeAction(type)) {
			throw new BadRequestError(REQUEST_ERRORS.BADREQUEST_LIKETYPE)
		}

		await postsRepository.like(user, id, type);
	};

	removeLike = async (user: DecodedIdToken, id?: string) => {
		if (!id) throw new BadRequestError(REQUEST_ERRORS.BADREQUEST_NOID);

		await postsRepository.removeLike(user, id);
	};
}

const postsService = new PostsService();

export default postsService;
