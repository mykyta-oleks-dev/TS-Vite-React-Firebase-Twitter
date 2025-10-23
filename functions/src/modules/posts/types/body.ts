import { Stringified } from '../../../shared/types/data/common';
import { PostData } from '../../../shared/types/data/Post';
import { Query } from '../../../shared/types/data/Query';

export type PostInfo = Omit<PostData, 'userId' | 'photo'> & {
	photo?: string | null;
};

export type PostInfoBody = Partial<PostInfo>;

export type PostInfoErrors = Partial<Stringified<PostInfo>>;

export type PostQuery = Query & { userId?: string; search?: string };
