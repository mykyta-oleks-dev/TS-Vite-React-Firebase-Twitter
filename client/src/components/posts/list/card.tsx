import type { Post } from '@/types/Post';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import Link from '../../link';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/button';
import { PenLineIcon, Trash2Icon } from 'lucide-react';
import type { User } from '@/types/User';

const PostCard = ({ post, user }: { post: Post; user?: User }) => {
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

			<div className="flex gap-3">
				{user && user.id === post.userId && (
					<>
						<Button
							size="icon"
							variant="ghost"
							className="rounded-full text-primary hover:text-primary ml-auto"
							asChild
						>
							<Link to={ROUTES.POST_EDIT(post.id)}>
								<PenLineIcon />
							</Link>
						</Button>
						<Button
							size="icon"
							variant="ghost"
							className="rounded-full text-destructive hover:text-destructive"
						>
							<Trash2Icon />
						</Button>
					</>
				)}
			</div>
		</div>
	);
};

export default PostCard;
