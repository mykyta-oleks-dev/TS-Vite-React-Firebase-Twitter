import { API } from '@/constants/env';
import axios from 'axios';
import { auth } from './firebase';
import { getIdToken } from 'firebase/auth';

const axiosInstance = axios.create({
	baseURL: API.ROUTE
})

axiosInstance.interceptors.request.use(async (config) => {
	const currentUser = auth.currentUser;

	if (currentUser) {
		const idToken = await getIdToken(currentUser);
		config.headers.Authorization = `Bearer ${idToken}`;
	}

	return config;
})

export default axiosInstance;
