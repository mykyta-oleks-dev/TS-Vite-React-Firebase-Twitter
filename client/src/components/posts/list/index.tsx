import { getPosts } from '@/api/posts';
import { API_ENDPOINTS } from '@/constants/api';
import usePaginationSearchParams from '@/hooks/usePaginationSearchParams';
import { cn } from '@/lib/utils';
import { parseFetchPost, type Post } from '@/types/Post';
import { useQuery } from '@tanstack/react-query';
import PageLoader from '../../page-loader';
import SearchParamsPagination from '../../search-params-pagination';
import PostCard from './card';
import PostsSearch from './search';
import useUser from '@/stores/authStore';
import type { LikeActionExt } from '@/types/Like';
import usePostManyLikeMutation from '@/hooks/usePostManyLikeMutation';

const PostsList = ({
	userId,
	className,
	sortType,
}: {
	userId?: Post['userId'];
	className?: string;
	sortType?: 'hot' | 'recent';
}) => {
	const {
		searchParams,
		setSearchParams,
		query: { page, limit, search, sort },
	} = usePaginationSearchParams(userId, sortType);

	const queryKey = [
		API_ENDPOINTS.POSTS.ROOT,
		{ page, limit, userId, search, sort },
	];

	const { data, isPending } = useQuery({
		queryKey,
		queryFn: async () => getPosts(search, userId, sort, page, limit),
		refetchOnWindowFocus: false
	});

	const { mutate } = usePostManyLikeMutation(queryKey);

	const userData = useUser((s) => s.userData);

	const posts = data?.posts.map((p) => parseFetchPost(p)) ?? [];
	const userLikes = data?.userLikes;

	const postsData = posts.map((p) => {
		const userLike = userLikes?.find((l) => l.postId === p.id);

		return {
			post: p,
			like: userLike,
		};
	});

	const handleLike = (postId: string, action: LikeActionExt) =>
		mutate({ postId, action });

	return (
		<div className={cn('flex flex-col gap-3', className)}>
			{isPending && <PageLoader />}
			<PostsSearch
				searchParams={searchParams}
				setSearchParams={setSearchParams}
			/>
			{(!data || !postsData.length) && (
				<p className="text-center p-10 text-xl">No post is availabe</p>
			)}
			{data && postsData.length > 0 && (
				<>
					<SearchParamsPagination
						searchParams={searchParams}
						page={page}
						maxPage={data.pages}
					/>

					<div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
						{postsData.map((pd) => (
							<PostCard
								key={pd.post.id}
								post={pd.post}
								like={pd.like}
								user={userData?.user}
								onLike={handleLike}
							/>
						))}
					</div>

					<SearchParamsPagination
						searchParams={searchParams}
						page={page}
						maxPage={data.pages}
					/>
				</>
			)}
		</div>
	);
};

export default PostsList;
