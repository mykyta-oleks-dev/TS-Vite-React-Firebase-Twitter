import { getPosts } from '@/api/posts';
import { API_ENDPOINTS } from '@/constants/api';
import { DEFAULT_LIMIT, MAX, MIN } from '@/constants/pagination';
import { parseFetchPost, type Post } from '@/types/Post';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router';
import PageLoader from '../page-loader';
import SearchParamsPagination from '../search-params-pagination';
import PostCard from './card';
import PostsSearch from './search';
import { cn } from '@/lib/utils';

const PostsList = ({
	userId,
	className,
}: {
	userId?: Post['userId'];
	className?: string;
}) => {
	const [searchParams, setSearchParams] = useSearchParams({
		page: '1',
		limit: DEFAULT_LIMIT + '',
		userId: userId ?? '',
	});

	const pageStr = searchParams.get('page');
	const page = pageStr
		? Math.min(Math.max(Number.parseInt(pageStr) ?? MIN, MIN), MAX)
		: MIN;

	const limitStr = searchParams.get('limit');
	const limit = limitStr
		? Math.min(
				Math.max(Number.parseInt(limitStr) ?? DEFAULT_LIMIT, MIN),
				MAX
		  )
		: DEFAULT_LIMIT;

	const search = searchParams.get('search');

	const { data, isPending } = useQuery({
		queryKey: [API_ENDPOINTS.POSTS.ROOT, { page, limit, userId, search }],
		queryFn: async () => getPosts(page, limit, search, userId),
	});

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
					<div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
						{posts.map((p) => (
							<PostCard key={p.id} post={p} />
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
