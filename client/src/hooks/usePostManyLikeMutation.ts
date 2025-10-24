import { like, removeLike } from '@/api/likes';
import { ROUTES } from '@/constants/routes';
import useUser, { type UserData } from '@/stores/authStore';
import type { ManyPosts } from '@/types/API';
import type { LikeAction, LikeApi } from '@/types/Like';
import {
	useMutation,
	useQueryClient,
	type QueryKey,
} from '@tanstack/react-query';
import { useNavigate } from 'react-router';

type LikeActionExt = LikeAction | 'remove';

const usePostManyLikeMutation = (queryKey: QueryKey) => {
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

			const posts = queryClient.getQueryData<ManyPosts>(queryKey);

			if (posts) {
				queryClient.setQueryData<ManyPosts>(queryKey, (oldPosts) => {
					if (!oldPosts) return posts;

					const oldLikeType = oldPosts.userLikes?.find(
						(l) => l.postId === postId
					)?.type;

					const newLikes = getNewLikes(
						oldPosts.userLikes,
						postId,
						action,
						userData
					);

					const newPosts = getNewPosts(
						oldPosts.posts,
						postId,
						action,
						oldLikeType
					);

					return {
						...oldPosts,
						posts: newPosts,
						userLikes: newLikes ?? oldPosts.userLikes,
					};
				});
			}
		},
	});
};

const getNewLikes = (
	userLikes: ManyPosts['userLikes'],
	postId: string,
	action: LikeActionExt,
	userData: NonNullable<UserData>
) => {
	const newLikes = structuredClone(userLikes);

	if (newLikes) {
		const likeIdx = newLikes.findIndex((like) => like.postId === postId);

		if (likeIdx > -1) {
			if (action === 'remove') {
				newLikes.splice(likeIdx, 1);
			} else {
				newLikes[likeIdx] = {
					...newLikes[likeIdx],
					type: action,
				};
			}
		} else if (action !== 'remove') {
			newLikes.push({
				timestamp: new Date().toISOString(),
				postId: postId,
				type: action,
				userId: userData.user.id,
			});
		}
	} else if (action !== 'remove') {
		return [
			{
				timestamp: new Date().toISOString(),
				postId: postId,
				type: action,
				userId: userData.user.id,
			},
		];
	}

	return newLikes;
};

const getNewPosts = (
	posts: ManyPosts['posts'],
	postId: string,
	action: LikeActionExt,
	oldLikeType?: LikeApi['type']
) => {
	const newPosts = structuredClone(posts);

	if (oldLikeType === action) return newPosts;

	return newPosts.map((p) => {
		if (p.id !== postId) {
			return p;
		}

		let likeDiff = 0;
		let dislikeDiff = 0;

		if (oldLikeType === 'dislike') dislikeDiff--;
		if (oldLikeType === 'like') likeDiff--;

		if (action !== 'remove') {
			if (action === 'dislike') dislikeDiff++;
			if (action === 'like') likeDiff++;
		}

		return {
			...p,
			likes: (p.likes ?? 0) + likeDiff,
			dislikes: (p.dislikes ?? 0) + dislikeDiff,
		};
	});
};

export default usePostManyLikeMutation;
