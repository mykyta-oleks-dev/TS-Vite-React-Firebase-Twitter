import axiosInstance from '@/config/axios';
import { API_ENDPOINTS } from '@/constants/api';
import type { postData } from '@/schemas/posts';
import type { CreatePost } from '@/types/API';

export const createPost = async (values: postData, photo: string | null) => {
	const res = await axiosInstance.post<CreatePost>(API_ENDPOINTS.POSTS.ROOT, {
		...values,
		photo,
	});

	const data = res.data;

	return data;
};
