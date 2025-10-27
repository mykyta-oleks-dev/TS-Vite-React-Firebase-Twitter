import PageTitle from '@/components/page-title';
import usePostCreateMutation from '@/hooks/post/usePostCreateMutation';
import PostForm from './components/form';
import { APP_NAME } from '@/constants/routes';

const CreatePostPage = () => {
	const { mutation, setWithPhoto } = usePostCreateMutation();
	const { mutateAsync } = mutation;

	return (
		<div>
			<title>{`${APP_NAME} - Create new Post`}</title>
			<PageTitle title="Create a new post" />
			<PostForm
				onSubmit={(data) => mutateAsync(data)}
				setWithPhoto={setWithPhoto}
			/>
		</div>
	);
};

export default CreatePostPage;
