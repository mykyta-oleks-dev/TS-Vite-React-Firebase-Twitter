import PageTitle from '@/components/page-title';
import PostForm from './components/form';
import usePostCreateMutation from '@/hooks/usePostCreateMutation';

const CreatePostPage = () => {
	const { mutateAsync } = usePostCreateMutation();

	return (
		<div>
			<PageTitle title="Create a new post" />
			<PostForm onSubmit={(data) => mutateAsync(data)} />
		</div>
	);
};

export default CreatePostPage;
