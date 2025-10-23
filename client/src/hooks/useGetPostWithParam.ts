import { getOnePost } from '@/api/posts';
import { API_ENDPOINTS } from '@/constants/api';
import { parseFetchPost } from '@/types/Post';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';

const useGetPostWithParam = () => {
	const { id } = useParams() as { id: string };
	return useQuery({
		queryKey: [API_ENDPOINTS.POSTS.ROOT, id],
		queryFn: async () => {
			const data = await getOnePost(id);

			return parseFetchPost(data.post);
		},
	});
};

export default useGetPostWithParam;
