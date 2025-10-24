import { formatLargeNumber } from '@/lib/utils';
import type { Like, LikeActionExt, LikeApi } from '@/types/Like';
import type { Post } from '@/types/Post';
import { HeartIcon, ThumbsDownIcon } from 'lucide-react';
import { Button } from '../ui/button';

const UserActions = ({
	post,
	like,
	onLike,
}: {
	post: Post;
	like?: Like | LikeApi;
	onLike: (postId: string, action: LikeActionExt) => void;
}) => {
	const likesCount = formatLargeNumber(post.likes);
	const dislikesCount = formatLargeNumber(post.dislikes);

	const isLiked = like?.type === 'like';
	const isDisliked = like?.type === 'dislike';

	const postId = post.id;

	return (
		<>
			<Button
				variant="outline"
				className="inline-flex text-sm items-center gap-1 rounded-full"
				onClick={() =>
					isLiked ? onLike(postId, 'remove') : onLike(postId, 'like')
				}
			>
				{likesCount}{' '}
				<HeartIcon
					fill={isLiked ? 'red' : 'transparent'}
					size={20}
					strokeWidth={1}
				/>
			</Button>
			<Button
				variant="outline"
				className="inline-flex text-sm items-center gap-1 rounded-full"
				onClick={() =>
					isDisliked
						? onLike(postId, 'remove')
						: onLike(postId, 'dislike')
				}
			>
				{dislikesCount}{' '}
				<ThumbsDownIcon
					fill={isDisliked ? 'green' : 'transparent'}
					size={18}
					strokeWidth={1}
				/>
			</Button>
		</>
	);
};

export default UserActions;
