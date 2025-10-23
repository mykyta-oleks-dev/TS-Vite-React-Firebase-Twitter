import { getOnePost } from '@/api/posts';
import Link from '@/components/link';
import PageLoader from '@/components/page-loader';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { API_ENDPOINTS } from '@/constants/api';
import { ROUTES } from '@/constants/routes';
import { handleError } from '@/lib/utils';
import { parseFetchPost } from '@/types/Post';
import { useQuery } from '@tanstack/react-query';
import { Navigate, useParams } from 'react-router';

const PostDetailsPage = () => {
	const { id } = useParams() as { id: string };
	const {
		data: post,
		error,
		isPending,
	} = useQuery({
		queryKey: [API_ENDPOINTS.POSTS.ROOT, id],
		queryFn: async () => {
			const data = await getOnePost(id);

			return parseFetchPost(data.post);
		},
	});

	if (isPending) return <PageLoader />;

	if (error) handleError(error, true);

	if (!post) return <Navigate to={ROUTES.ROOT} />;

	const content = post.content
		.split('\n')
		.map((p, idx) => <p key={`post-${post.id}-${idx}`}>{p}</p>);

	return (
		<div>
			<Link
				to={ROUTES.PROFILE_VIEW(post.userId)}
				className="flex gap-3 items-center"
			>
				<Avatar className="size-16">
					<AvatarImage src={post.userAvatar} />
					<AvatarFallback>
						{post.userName.substring(0, 2)}
					</AvatarFallback>
				</Avatar>
				<div className="flex flex-col items-start">
					<span className="text-lg font-semibold">
						{post.userName}
					</span>
					<time
						className="text-sm text-gray-500 no-underline hover:no-underline"
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

			<hr className="my-3" />

			<div className="flex flex-col md:flex-row gap-3">
				{post.photo && (
					<>
						<img
							className="object-cover lg:w-96"
							src={post.photo}
							alt={post.title}
						/>
						<hr className="md:hidden" />
					</>
				)}
				<div className="flex flex-col gap-3">
					<h3 className="text-md font-semibold">{post.title}</h3>
					<div className="text-sm">
						{content}
					</div>
				</div>
			</div>
			
			<hr className='my-3' />
		</div>
	);
};

export default PostDetailsPage;
