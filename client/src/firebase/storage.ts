import { storage } from '@/config/firebase';
import { FOLDERS } from '@/constants/storage';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

export const uploadAvatar = async (avatar: File) => {
	const imageName = `${Date.now()}-${avatar.name}`;
	const imagePath = `${FOLDERS.AVATARS}/${imageName}`;

	const avatarRef = ref(storage, imagePath);

	const result = await uploadBytes(avatarRef, avatar);
	const imageUrl = await getDownloadURL(result.ref);

	return imageUrl;
};
