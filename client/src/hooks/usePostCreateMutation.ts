import { createPost } from '@/api/posts';
import { API_ENDPOINTS } from '@/constants/api';
import { ROUTES } from '@/constants/routes';
import { FOLDERS } from '@/constants/storage';
import { uploadFile } from '@/firebase/storage';
import { handleError } from '@/lib/utils';
import type { postData } from '@/schemas/posts';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

const usePostCreateMutation = () => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: async (values: postData) => {
			const photo = values.photo
				? await uploadFile(values.photo, FOLDERS.POSTS)
				: null;

			return await createPost(values, photo);
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: [API_ENDPOINTS.POSTS.ROOT],
			});

			navigate(ROUTES.ROOT)
		},
		onError: (error) => handleError(error, true),
	});
};

export default usePostCreateMutation;
