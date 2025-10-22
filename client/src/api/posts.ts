import axiosInstance from '@/config/axios';
import { API_ENDPOINTS } from '@/constants/api';
import type { postData } from '@/schemas/posts';
import type { CreatePost, ManyPosts } from '@/types/API';

export const createPost = async (values: postData, photo: string | null) => {
	const res = await axiosInstance.post<CreatePost>(API_ENDPOINTS.POSTS.ROOT, {
		...values,
		photo,
	});

	const data = res.data;

	return data;
};

export const getPosts = async (page = 1, limit = 10, search: string | null, userId?: string) => {
	const res = await axiosInstance.get<ManyPosts>(API_ENDPOINTS.POSTS.ROOT, {
		params: {
			page,
			limit,
			userId: userId ?? null,
			search: search ?? null,
		},
	});

	const data = res.data;

	return data;
};
