import { updatePost } from '@/api/posts';
import { API_ENDPOINTS } from '@/constants/api';
import { ROUTES } from '@/constants/routes';
import { FOLDERS } from '@/constants/storage';
import { deleteFile, uploadFile } from '@/firebase/storage';
import { handleError } from '@/lib/utils';
import type { postData } from '@/schemas/posts';
import type { Post } from '@/types/Post';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router';

const usePostUpdateMutation = (original?: Post) => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const [withPhoto, setWithPhoto] = useState(!!original?.photo);

	return {
		mutation: useMutation({
			mutationFn: async (values: postData) => {
				if (!original) return;

				console.log(values.photo, withPhoto, original.photo);

				const photo = values.photo
					? await uploadFile(values.photo, FOLDERS.POSTS)
					: withPhoto
					? original.photo
					: null;

				return {
					data: await updatePost(original.id, values, photo),
					oldPhoto: photo !== original.photo && original.photo,
				};
			},
			onSuccess: async (results) => {
				if (!results) return;

				const { data, oldPhoto } = results;

				if (oldPhoto) await deleteFile(oldPhoto);

				await queryClient.invalidateQueries({
					queryKey: [API_ENDPOINTS.POSTS.ROOT],
				});

				navigate(ROUTES.POST_VIEW(data.postId));
			},
			onError: (error) => handleError(error, true),
		}),
		withPhoto,
		setWithPhoto,
	};
};

export default usePostUpdateMutation;
