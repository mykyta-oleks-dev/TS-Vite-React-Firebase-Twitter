import { getPosts } from '@/api/posts';
import { API_ENDPOINTS } from '@/constants/api';
import { DEFAULT_LIMIT, MIN } from '@/constants/pagination';
import type { Post } from '@/types/Post';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router';
import PageLoader from '../page-loader';
import SearchParamsPagination from '../search-params-pagination';

const PostsList = ({ userId }: { userId?: Post['userId'] }) => {
	const [searchParams] = useSearchParams({
		page: '1',
		limit: '1',
		userId: userId ?? '',
	});

	const pageStr = searchParams.get('page');
	const page = pageStr ? Math.max(Number.parseInt(pageStr) ?? MIN, MIN) : MIN;

	const limitStr = searchParams.get('limit');
	const limit = limitStr
		? Math.max(Number.parseInt(limitStr) ?? DEFAULT_LIMIT, MIN)
		: DEFAULT_LIMIT;

	const { data, isPending } = useQuery({
		queryKey: [API_ENDPOINTS.POSTS.ROOT, { page, limit, userId }],
		queryFn: async () => getPosts(page, limit, userId),
	});

	return (
		<div>
			{isPending && <PageLoader />}
			{data?.posts?.map((p) => (
				<p key={p.id}>{p.title}</p>
			))}
			<SearchParamsPagination
				searchParams={searchParams}
				page={page}
				maxPage={data?.pages}
			/>
		</div>
	);
};

export default PostsList;
