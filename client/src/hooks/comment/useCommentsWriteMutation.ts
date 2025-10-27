import { createComment } from '@/api/comments';
import { handleError } from '@/lib/utils';
import useUser from '@/stores/authStore';
import type { OnePost } from '@/types/API';
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
			respondedToId,
		}: {
			text: string;
			postId: string;
			respondedToId?: string;
		}) => {
			if (!userData) return;

			return await createComment(text, postId, respondedToId);
		},

		onError(error) {
			handleError(error, true);
		},

		onSuccess(data) {
			if (!data) return;

			const comment = data.comment;

			queryClient.setQueryData<OnePost>(queryKey, (prev) => {
				if (!prev) return prev;

				return {
					...prev,
					comments: [comment, ...(prev.comments ?? [])],
				};
			});
		},
	});
};

export default useCommentsWriteMutation;
