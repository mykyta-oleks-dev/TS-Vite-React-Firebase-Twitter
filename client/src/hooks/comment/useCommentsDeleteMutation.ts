import { deleteComment } from '@/api/comments';
import { handleError } from '@/lib/utils';
import useUser from '@/stores/authStore';
import type { OnePost } from '@/types/API';
import type { Comment } from '@/types/Comment';
import {
	useMutation,
	useQueryClient,
	type QueryKey,
} from '@tanstack/react-query';

const useCommentsWriteMutation = (queryKey: QueryKey) => {
	const queryClient = useQueryClient();
	const userData = useUser((s) => s.userData);

	return useMutation({
		mutationFn: async ({
			postId,
			original,
		}: {
			postId: string;
			original: Comment;
		}) => {
			if (!userData) return;

			return await deleteComment(postId, original.id);
		},

		onError(error) {
			handleError(error, true);
		},

		onSuccess(_data, { original }) {
			queryClient.setQueryData<OnePost>(queryKey, (prev) => {
				if (!prev) return prev;

				return {
					...prev,
					comments: prev.comments?.map((c) => {
						if (c.id !== original.id) return c;

						return {
							...c,
							text: '[deleted]',
							userAvatar: null,
							userName: '[deleted]',
							isDeleted: true,
							userId: '[deleted]',
						};
					}),
				};
			});
		},
	});
};

export default useCommentsWriteMutation;
