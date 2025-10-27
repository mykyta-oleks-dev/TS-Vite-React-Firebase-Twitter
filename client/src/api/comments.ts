import axiosInstance from '@/config/axios';
import { API_ENDPOINTS } from '@/constants/api';
import type { CreateComment } from '@/types/API';

export const createComment = async (
	text: string,
	postId: string,
	responseTo?: string
) => {
	const res = await axiosInstance.post<CreateComment>(
		API_ENDPOINTS.POSTS.COMMENT_CREATE(postId),
		{
			text,
			responseTo,
		}
	);

	const data = res.data;

	return data;
};

export const editComment = async (
	text: string,
	postId: string,
	commentId: string
) =>
	await axiosInstance.patch(
		API_ENDPOINTS.POSTS.COMMENT_ONE(postId, commentId),
		{
			text,
		}
	);

export const deleteComment = async (postId: string, commentId: string) =>
	await axiosInstance.delete(
		API_ENDPOINTS.POSTS.COMMENT_ONE(postId, commentId)
	);
