import { DecodedIdToken } from 'firebase-admin/auth';
import { PostInfoBody } from './types/body';
import { assertIsPostInfo, validatePostInfoBody } from './utils/validate';
import { BadRequestError } from '../../middlewares/ErrorHandling';
import { REQUEST_ERRORS } from './constants/Errors';
import postsRepository from './posts.repository';
import { auth } from '../../config/firebase';

class PostsService {
	create = async (user: DecodedIdToken, body: PostInfoBody) => {
		const errors = validatePostInfoBody(body);

		if (!assertIsPostInfo(body, errors)) {
			throw new BadRequestError(REQUEST_ERRORS.BADREQUEST_CREATE);
		}

		const userRecord = await auth.getUser(user.uid);

		return postsRepository.create(userRecord, body);
	};
}

const postsService = new PostsService();

export default postsService;
