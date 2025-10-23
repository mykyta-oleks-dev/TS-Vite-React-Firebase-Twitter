import { DecodedIdToken } from 'firebase-admin/auth';
import { PostInfoBody, PostQuery } from './types/body';
import { assertIsPostInfo, validatePostInfoBody } from './utils/validate';
import { BadRequestError } from '../../middlewares/ErrorHandling';
import { REQUEST_ERRORS } from './constants/Errors';
import postsRepository from './posts.repository';
import { auth } from '../../config/firebase';
import { isNotEmptyObj, validateQuery } from '../../shared/utils/validation';
import { SHARED_REQ_ERRORS } from '../../shared/constants/Errors';

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

	getMany = async (query: PostQuery) => {
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
			query.userId,
			query.search
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
}

const postsService = new PostsService();

export default postsService;
