import { createPost } from '@/api/posts';
import { API_ENDPOINTS } from '@/constants/api';
import { ROUTES } from '@/constants/routes';
import { FOLDERS } from '@/constants/storage';
import { uploadFile } from '@/firebase/storage';
import { handleError } from '@/lib/utils';
import type { postData } from '@/schemas/posts';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router';

const usePostCreateMutation = () => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const [withPhoto, setWithPhoto] = useState(false);

	return {
		mutation: useMutation({
			mutationFn: async (values: postData) => {
				const photo =
					values.photo && withPhoto
						? await uploadFile(values.photo, FOLDERS.POSTS)
						: null;

				return await createPost(values, photo);
			},
			onSuccess: async (data) => {
				await queryClient.invalidateQueries({
					queryKey: [API_ENDPOINTS.POSTS.ROOT],
				});

				navigate(ROUTES.POST_VIEW(data.postId));
			},
			onError: (error) => handleError(error, true),
		}),
		setWithPhoto,
	};
};

export default usePostCreateMutation;
