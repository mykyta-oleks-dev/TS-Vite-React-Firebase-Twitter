import type { CommentApi } from './Comment';
import type { LikeApi } from './Like';
import type { PostApi } from './Post';
import type { UserApi } from './User';

export interface DefaultBody {
	message: string;
}

export interface ErrorResponse extends DefaultBody {
	status: 'error' | 'fail';
	stack?: string;
	errors?: unknown;
	payload?: Record<string, string | number>;
}

export interface AuthBody extends DefaultBody {
	token: string;
}

export interface OneUser extends DefaultBody {
	user: UserApi;
	isVerified: boolean;
}

export interface ManyUsers extends DefaultBody {
	users: UserApi[];
}

export interface WritePost extends DefaultBody {
	postId: string;
}

export interface OnePost extends DefaultBody {
	post: PostApi;
	userLike?: LikeApi;
	comments?: CommentApi[];
}

export interface ManyPosts extends DefaultBody {
	posts: PostApi[];
	total: number;
	pages: number;
	userLikes?: LikeApi[];
}
