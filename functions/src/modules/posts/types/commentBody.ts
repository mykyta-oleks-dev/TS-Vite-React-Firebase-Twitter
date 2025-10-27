import { CommentData } from '../../../shared/types/data/Comment';
import { Stringified } from '../../../shared/types/data/common';

export type CommentInfo = Omit<CommentData, 'userId' | 'postId' | 'isDeleted'>;

export type CommentInfoBody = Partial<CommentInfo>;

export type CommentInfoErrors = Partial<Stringified<CommentInfo>>;
