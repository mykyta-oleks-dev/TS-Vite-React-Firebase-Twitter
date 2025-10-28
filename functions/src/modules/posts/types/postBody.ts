import { Stringified } from '../../../shared/types/data/common.js';
import { PostData } from '../../../shared/types/data/Post.js';
import { Query } from '../../../shared/types/data/Query.js';

export type PostInfo = Omit<
	PostData,
	'userId' | 'photo' | 'likes' | 'dislikes' | 'compositeScore'
> & {
	photo?: string | null;
};

export type PostInfoBody = Partial<PostInfo>;

export type PostInfoErrors = Partial<Stringified<PostInfo>>;

export type PostQuery = Query & {
	userId?: string;
	search?: string;
	sort?: 'hot' | 'recent';
};
