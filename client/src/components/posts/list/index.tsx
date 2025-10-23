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

const PostsList = ({
	userId,
	className,
}: {
	userId?: Post['userId'];
	className?: string;
}) => {
	const {
		searchParams,
		setSearchParams,
		query: { page, limit, search },
	} = usePaginationSearchParams(userId);

	const { data, isPending } = useQuery({
		queryKey: [API_ENDPOINTS.POSTS.ROOT, { page, limit, userId, search }],
		queryFn: async () => getPosts(search, userId, page, limit),
	});

	const userData = useUser((s) => s.userData);

	const posts = data?.posts.map((p) => parseFetchPost(p)) ?? [];

	return (
		<div className={cn('flex flex-col gap-3', className)}>
			{isPending && <PageLoader />}
			<PostsSearch
				delay={1000}
				searchParams={searchParams}
				setSearchParams={setSearchParams}
			/>
			{(!data || !posts.length) && (
				<p className="text-center p-10 text-xl">No post is availabe</p>
			)}
			{data && !!posts.length && (
				<>
					<SearchParamsPagination
						searchParams={searchParams}
						page={page}
						maxPage={data.pages}
					/>

					<div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
						{posts.map((p) => (
							<PostCard
								key={p.id}
								post={p}
								user={userData?.user}
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
