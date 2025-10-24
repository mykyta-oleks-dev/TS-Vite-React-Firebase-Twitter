import { ROUTES } from '@/constants/routes';
import type { Like, LikeActionExt, LikeApi } from '@/types/Like';
import type { Post } from '@/types/Post';
import type { User } from '@/types/User';
import Link from '../../link';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import PostCreatorActions from '../creator-actions';
import UserActions from '../user-actions';

const PostCard = ({
	post,
	user,
	like,
	onLike,
}: {
	post: Post;
	user?: User;
	like?: LikeApi | Like;
	onLike: (postId: string, action: LikeActionExt) => void;
}) => {
	const content = post.content
		.split('\n')
		.map((p, idx) => <p key={`post-${post.id}-${idx}`}>{p}</p>);

	return (
		<div className="p-3 flex flex-col gap-3 border transition hover:border-primary rounded-md">
			<Link
				to={ROUTES.PROFILE_VIEW(post.userId)}
				className="flex gap-3 items-center"
			>
				<Avatar>
					<AvatarImage src={post.userAvatar} />
					<AvatarFallback>
						{post.userName.substring(0, 2)}
					</AvatarFallback>
				</Avatar>
				<div className="flex flex-col items-start">
					<span className="text-sm font-semibold">
						{post.userName}
					</span>
					<time
						className="text-xs text-gray-500 no-underline hover:no-underline"
						dateTime={post.createdAt.toISOString()}
					>
						{post.createdAt.toLocaleDateString('en-US', {
							year: 'numeric',
							month: 'long',
							day: 'numeric',
							hour: 'numeric',
							minute: 'numeric',
							second: 'numeric',
						})}
					</time>
				</div>
			</Link>

			<hr />

			<Link
				to={ROUTES.POST_VIEW(post.id)}
				className="flex flex-col justify-start gap-3 no-underline hover:no-underline flex-1"
			>
				{post.photo && (
					<>
						<img
							className="object-cover md:h-80 lg:h-64"
							src={post.photo}
							alt={post.title}
						/>
						<hr />
					</>
				)}
				<h3 className="text-md font-semibold">{post.title}</h3>
				<div className="text-sm line-clamp-5 text-ellipsis">
					{content}
				</div>
			</Link>

			<div className="flex gap-1 items-center">
				<UserActions like={like} post={post} onLike={onLike} />
				{user && user.id === post.userId && (
					<PostCreatorActions post={post} />
				)}
			</div>
		</div>
	);
};

export default PostCard;
