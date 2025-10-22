import type { Post } from '@/types/Post';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const PostCard = ({ post }: { post: Post }) => {
	const content = post.content
		.split('\n')
		.map((p, idx) => <p key={`post-${post.id}-${idx}`}>{p}</p>);

	return (
		<div className="flex flex-col gap-3 p-3 border transition hover:border-primary rounded-md">
			<div className="flex gap-3 items-center">
				<Avatar>
					<AvatarImage src={post.userAvatar} />
					<AvatarFallback>
						{post.userName.substring(0, 2)}
					</AvatarFallback>
				</Avatar>
				<div className="flex flex-col">
					<span className="text-sm font-semibold">{post.userName}</span>
					<time
						className="text-xs text-gray-500"
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
			</div>
			<hr />
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
			<div className="text-sm line-clamp-5 text-ellipsis">{content}</div>
		</div>
	);
};

export default PostCard;
