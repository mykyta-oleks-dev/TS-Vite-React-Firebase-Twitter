import { createPost } from '@/api/posts';
import router from '@/config/router';
import { ROUTES } from '@/constants/routes';
import { FOLDERS } from '@/constants/storage';
import { uploadFile } from '@/firebase/storage';
import { handleError } from '@/lib/utils';
import type { postData } from '@/schemas/posts';

export const handleCreate = async (values: postData) => {
	try {
		const photo =
			values.photo ? (await uploadFile(values.photo, FOLDERS.POSTS)) : null;

		await createPost(values, photo);

		router.navigate(ROUTES.ROOT);
	} catch (err) {
		handleError(err, true);
	}
};
