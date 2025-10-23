import PageLoader from '@/components/page-loader';
import PageTitle from '@/components/page-title';
import { ROUTES } from '@/constants/routes';
import useGetPostWithParam from '@/hooks/useGetPostWithParam';
import usePostUpdateMutation from '@/hooks/usePostUpdateMutation';
import { handleError } from '@/lib/utils';
import { Navigate } from 'react-router';
import PostForm from './components/form';

const EditPostPage = () => {
	const { isPending, error, data: post } = useGetPostWithParam();
	const { mutation, setWithPhoto } = usePostUpdateMutation(post);

	const { mutateAsync } = mutation;

	if (isPending) return <PageLoader />;

	if (error) handleError(error, true);

	if (!post) return <Navigate to={ROUTES.ROOT} />;

	return (
		<div>
			<PageTitle title="Create a new post" />
			<PostForm
				post={post}
				onSubmit={(data) =>
					mutateAsync(data)
				}
				setWithPhoto={setWithPhoto}
			/>
		</div>
	);
};

export default EditPostPage;
