import { storage } from '@/config/firebase';
import {
	deleteObject,
	getDownloadURL,
	ref,
	uploadBytes,
} from 'firebase/storage';

export const uploadFile = async (file: File, folder: string) => {
	const fileName = `${Date.now()}-${file.name}`;
	const filePath = `${folder}/${fileName}`;

	const fileRef = ref(storage, filePath);

	const result = await uploadBytes(fileRef, file);
	const fileUrl = await getDownloadURL(result.ref);

	return fileUrl;
};

export const deleteFile = async (file: string) => {
	const fileRef = ref(storage, file);

	await deleteObject(fileRef);
};
