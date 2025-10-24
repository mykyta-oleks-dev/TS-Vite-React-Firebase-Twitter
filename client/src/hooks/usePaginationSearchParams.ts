import { DEFAULT_LIMIT, MAX, MIN } from '@/constants/pagination';
import { useSearchParams } from 'react-router';

const usePaginationSearchParams = (userId?: string, sort?: string) => {
	const [searchParams, setSearchParams] = useSearchParams({
		page: '1',
		limit: DEFAULT_LIMIT + '',
		userId: userId ?? '',
		sort: sort ?? '',
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
	const sortType = searchParams.get('sort');

	return {
		searchParams,
		setSearchParams,
		query: {
			page,
			limit,
			search,
			sort: sortType,
		},
	};
};

export default usePaginationSearchParams;
