import PageTitle from '@/components/page-title';
import usePostCreateMutation from '@/hooks/post/usePostCreateMutation';
import PostForm from './components/form';

const CreatePostPage = () => {
	const { mutation, setWithPhoto } = usePostCreateMutation();
	const { mutateAsync } = mutation;

	return (
		<div>
			<PageTitle title="Create a new post" />
			<PostForm
				onSubmit={(data) => mutateAsync(data)}
				setWithPhoto={setWithPhoto}
			/>
		</div>
	);
};

export default CreatePostPage;
