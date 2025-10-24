import { getOnePost } from '@/api/posts';
import { API_ENDPOINTS } from '@/constants/api';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';

const useGetPostWithParam = () => {
	const { id } = useParams() as { id: string };

	const queryKey = [API_ENDPOINTS.POSTS.ROOT, id];

	return {
		...useQuery({
			queryKey,
			queryFn: async () => await getOnePost(id),
		}),
		queryKey,
	};
};

export default useGetPostWithParam;
