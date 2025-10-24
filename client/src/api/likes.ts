import axiosInstance from '@/config/axios';
import { API_ENDPOINTS } from '@/constants/api';
import type { LikeAction } from '@/types/Like';

export const like = async (postId: string, type: LikeAction) =>
	await axiosInstance.put(API_ENDPOINTS.POSTS.LIKE(postId), {
		type,
	});

export const removeLike = async (postId: string) =>
	await axiosInstance.delete(API_ENDPOINTS.POSTS.LIKE(postId));
