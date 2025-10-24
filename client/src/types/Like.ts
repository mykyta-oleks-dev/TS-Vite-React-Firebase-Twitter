export type LikeAction = 'like' | 'dislike';

export type LikeActionExt = LikeAction | 'remove';

interface LikePrimitives {
	type: LikeAction;
	userId: string;
	postId: string;
}

export interface LikeApi extends LikePrimitives {
	timestamp: string;
}

export interface Like extends LikePrimitives {
	timestamp: Date;
}
