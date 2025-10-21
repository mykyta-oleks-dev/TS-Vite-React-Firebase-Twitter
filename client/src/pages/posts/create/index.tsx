import PageTitle from '@/components/page-title';
import PostForm from './components/form';
import { handleCreate } from '@/handlers/post';

const CreatePostPage = () => {
	return (
		<div>
			<PageTitle title="Create a new post" />
			<PostForm onSubmit={handleCreate} />
		</div>
	);
};

export default CreatePostPage;
