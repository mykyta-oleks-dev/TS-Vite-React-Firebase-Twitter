import { deletePost } from '@/api/posts';
import { API_ENDPOINTS } from '@/constants/api';
import { ROUTES } from '@/constants/routes';
import { deleteFile } from '@/firebase/storage';
import { handleError } from '@/lib/utils';
import type { Post } from '@/types/Post';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

const usePostDeleteMutation = () => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: async (post: Post) => {
			await deletePost(post.id);

			return post;
		},
		onSuccess: async (post) => {
			if (post.photo) await deleteFile(post.photo);

			toast.success(`Your post "${post.title}" has been deleted.`);

			navigate(ROUTES.ROOT);

			await queryClient.invalidateQueries({
				queryKey: [API_ENDPOINTS.POSTS.ROOT],
			});
		},
		onError: (error) => handleError(error, true),
	});
};

export default usePostDeleteMutation;
