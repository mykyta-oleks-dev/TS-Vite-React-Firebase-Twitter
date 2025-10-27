import { createComment } from '@/api/comments';
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
			text,
			postId,
			respondedTo,
		}: {
			text: string;
			postId: string;
			original?: Comment;
			respondedTo?: Comment;
		}) => {
			if (!userData) return;

			return await createComment(text, postId, respondedTo?.id);
		},

		onError(error) {
			handleError(error, true);
		},

		onSuccess(data, variables) {
			if (!data) return;

			if (!variables.original) {
				const comment = data.comment;

				queryClient.setQueryData<OnePost>(queryKey, (prev) => {
					if (!prev) return prev;

					return {
						...prev,
						comments: [comment, ...(prev.comments ?? [])],
					};
				});
			}
		},
	});
};

export default useCommentsWriteMutation;
