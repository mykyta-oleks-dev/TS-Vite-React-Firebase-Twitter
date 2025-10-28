import { formatLargeNumber } from '@/lib/utils';
import type { Like, LikeActionExt, LikeApi } from '@/types/Like';
import type { Post } from '@/types/Post';
import { HeartIcon, MessageSquareTextIcon, ThumbsDownIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Link } from 'react-router';
import { ROUTES } from '@/constants/routes';
import useUser from '@/stores/authStore';

const UserActions = ({
	post,
	like,
	onLike,
	showComments,
}: {
	post: Post;
	like?: Like | LikeApi;
	onLike: (postId: string, action: LikeActionExt) => void;
	showComments?: boolean;
}) => {
	const userData = useUser(s => s.userData);
	
	const likesCount = formatLargeNumber(post.likes);
	const dislikesCount = formatLargeNumber(post.dislikes);
	const commentsCount = formatLargeNumber(post.comments);

	const isLiked = like?.type === 'like' && userData?.user.id === like?.userId;
	const isDisliked = like?.type === 'dislike' && userData?.user.id === like?.userId;

	const postId = post.id;

	return (
		<>
			<Button
				variant="outline"
				className="inline-flex text-xs items-center gap-1 rounded-full"
				onClick={() =>
					isLiked ? onLike(postId, 'remove') : onLike(postId, 'like')
				}
			>
				{likesCount}{' '}
				<HeartIcon
					fill={isLiked ? 'red' : 'transparent'}
					size={15}
					strokeWidth={1}
				/>
			</Button>
			<Button
				variant="outline"
				className="inline-flex text-xs items-center gap-1 rounded-full"
				onClick={() =>
					isDisliked
						? onLike(postId, 'remove')
						: onLike(postId, 'dislike')
				}
			>
				{dislikesCount}{' '}
				<ThumbsDownIcon
					fill={isDisliked ? 'green' : 'transparent'}
					size={12}
					strokeWidth={1}
				/>
			</Button>
			{showComments && (
				<Button
					variant="outline"
					className="inline-flex text-xs items-center gap-1 rounded-full"
					asChild
				>
					<Link to={ROUTES.POST_VIEW(post.id)}>
						{commentsCount}{' '}
						<MessageSquareTextIcon size={15} strokeWidth={1} />
					</Link>
				</Button>
			)}
		</>
	);
};

export default UserActions;
