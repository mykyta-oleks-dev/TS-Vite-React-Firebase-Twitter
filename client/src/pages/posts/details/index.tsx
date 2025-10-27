import Link from '@/components/link';
import PageLoader from '@/components/page-loader';
import PostCreatorActions from '@/components/posts/creator-actions';
import UserActions from '@/components/posts/user-actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ROUTES } from '@/constants/routes';
import useGetPostWithParam from '@/hooks/useGetPostWithParam';
import usePostOneLikeMutation from '@/hooks/usePostOneLikeMutation';
import { handleError } from '@/lib/utils';
import useUser from '@/stores/authStore';
import { parseFetchComment } from '@/types/Comment';
import type { LikeActionExt } from '@/types/Like';
import { parseFetchPost } from '@/types/Post';
import { Navigate } from 'react-router';
import CommentsSection from '../components/comments-section';

const PostDetailsPage = () => {
	const { isPending, error, data, queryKey } = useGetPostWithParam();
	const userData = useUser((s) => s.userData);
	const { mutate } = usePostOneLikeMutation(queryKey);

	if (isPending) return <PageLoader />;
	if (error) handleError(error, true);

	if (!data) return <Navigate to={ROUTES.ROOT} />;

	const { post: postData, userLike, comments: commentsData } = data;
	const post = parseFetchPost(postData);
	const comments = commentsData?.map((c) => parseFetchComment(c));

	const handlelike = (postId: string, action: LikeActionExt) =>
		mutate({ postId, action });

	const content = post.content
		.split('\n')
		.map((p, idx) => <p key={`post-${post.id}-${idx}`}>{p}</p>);

	return (
		<div className="flex flex-col gap-3">
			<div className="flex gap-3 items-center">
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
				{userData && userData.user.id === post.userId && (
					<PostCreatorActions post={post} />
				)}
			</div>

			<hr />

			<div className="flex flex-col lg:flex-row gap-3">
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
					<div className="text-sm">{content}</div>
				</div>
			</div>

			<hr />

			<div className="flex gap-1 items-center">
				<UserActions post={post} like={userLike} onLike={handlelike} />
			</div>

			{comments && (
				<CommentsSection
					comments={comments}
					postId={post.id}
					queryKey={queryKey}
				/>
			)}
		</div>
	);
};

export default PostDetailsPage;
