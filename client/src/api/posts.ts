import axiosInstance from '@/config/axios';
import { API_ENDPOINTS } from '@/constants/api';
import type { postData } from '@/schemas/posts';
import type { OnePost, WritePost, ManyPosts } from '@/types/API';

export const createPost = async (values: postData, photo: string | null) => {
	const res = await axiosInstance.post<WritePost>(API_ENDPOINTS.POSTS.ROOT, {
		...values,
		photo,
	});

	const data = res.data;

	return data;
};

export const getPosts = async (
	search: string | null,
	userId?: string,
	page = 1,
	limit = 10
) => {
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

export const getOnePost = async (id: string) => {
	const res = await axiosInstance.get<OnePost>(
		API_ENDPOINTS.POSTS.GET_ONE(id)
	);

	const data = res.data;

	return data;
};

export const updatePost = async (
	id: string,
	values: postData,
	photo?: string | null
) => {
	const res = await axiosInstance.put<WritePost>(
		API_ENDPOINTS.POSTS.GET_ONE(id),
		{
			...values,
			photo: photo ?? null,
		}
	);

	const data = res.data;

	return data;
};

export const deletePost = async (id: string) =>
	await axiosInstance.delete(API_ENDPOINTS.POSTS.GET_ONE(id));
