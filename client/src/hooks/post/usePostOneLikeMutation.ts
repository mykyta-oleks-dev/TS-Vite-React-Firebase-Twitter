import { like, removeLike } from '@/api/likes';
import { ROUTES } from '@/constants/routes';
import { handleError } from '@/lib/utils';
import useUser, { type UserData } from '@/stores/authStore';
import type { OnePost } from '@/types/API';
import type { LikeAction, LikeApi } from '@/types/Like';
import {
	useMutation,
	useQueryClient,
	type QueryKey,
} from '@tanstack/react-query';
import { useNavigate } from 'react-router';

type LikeActionExt = LikeAction | 'remove';

const usePostOneLikeMutation = (queryKey: QueryKey) => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const userData = useUser((s) => s.userData);

	return useMutation({
		mutationFn: async ({
			postId,
			action,
		}: {
			postId: string;
			action: LikeActionExt;
		}) => {
			if (!userData) {
				navigate(ROUTES.LOG_IN);
				return;
			}

			if (action === 'remove') {
				await removeLike(postId);
			} else {
				await like(postId, action);
			}
		},
		onMutate: async ({ postId, action }) => {
			if (!userData) return;

			await queryClient.cancelQueries({ queryKey });

			const post = queryClient.getQueryData<OnePost>(queryKey);

			if (post) {
				queryClient.setQueryData<OnePost>(queryKey, (oldPost) => {
					if (!oldPost) return post;

					const oldLikeType = oldPost.userLike?.type;

					const newLike = getNewLike(
						oldPost.userLike,
						postId,
						action,
						userData
					);

					const newPost = getNewPost(
						oldPost.post,
						action,
						oldLikeType
					);

					return {
						...oldPost,
						post: newPost,
						userLike: newLike,
					};
				});
			}
		},

		onError: (error, _variables, context) => {
			handleError(error, true);
			if (context) {
				queryClient.setQueryData<OnePost>(queryKey, context);
			}
		},
	});
};

const getNewLike = (
	userLike: OnePost['userLike'],
	postId: string,
	action: LikeActionExt,
	userData: NonNullable<UserData>
): OnePost['userLike'] => {
	const like = structuredClone(userLike);

	if (like) {
		if (action === 'remove') {
			return undefined;
		} else {
			return {
				...like,
				type: action,
			};
		}
	} else if (action !== 'remove') {
		return {
			postId: postId,
			timestamp: new Date().toISOString(),
			userId: userData.user.id,
			type: action,
		};
	}

	return like;
};

const getNewPost = (
	post: OnePost['post'],
	action: LikeActionExt,
	oldLikeType?: LikeApi['type']
) => {
	const newPost = structuredClone(post);

	if (oldLikeType === action) return newPost;

	console.log({ oldLikeType, action });

	let likeDiff = 0;
	let dislikeDiff = 0;

	if (oldLikeType === 'dislike') dislikeDiff--;
	if (oldLikeType === 'like') likeDiff--;

	if (action !== 'remove') {
		if (action === 'dislike') dislikeDiff++;
		if (action === 'like') likeDiff++;
	}

	return {
		...newPost,
		likes: (newPost.likes ?? 0) + likeDiff,
		dislikes: (newPost.dislikes ?? 0) + dislikeDiff,
	};
};

export default usePostOneLikeMutation;
