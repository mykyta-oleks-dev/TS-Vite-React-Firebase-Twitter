import { Stringified } from '../../../shared/types/data/common';
import { PostData } from '../../../shared/types/data/Post';

export type PostInfo = PostData;

export type PostInfoBody = Partial<PostInfo>;

export type PostInfoErrors = Partial<Stringified<PostInfo>>;
