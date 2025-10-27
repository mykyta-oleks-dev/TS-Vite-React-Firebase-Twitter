import CommentBlock from '@/components/comment';
import Link from '@/components/link';
import { ROUTES } from '@/constants/routes';
import useUser from '@/stores/authStore';
import type { Comment } from '@/types/Comment';
import CommentInput from './comment-input';
import useCommentsWriteMutation from '@/hooks/useCommentsWriteMutation';
import type { QueryKey } from '@tanstack/react-query';

const CommentsSection = ({ comments, postId, queryKey }: { comments: Comment[]; postId: string; queryKey: QueryKey }) => {
	const isAuthenticated = useUser((s) => s.isAuthenticated);

	const { mutateAsync, isPending } = useCommentsWriteMutation(queryKey);

	const handleSubmit = async (text: string) => {
		await mutateAsync({text, postId});
	}

	return (
		<>
			<hr />

			<div className="flex flex-col gap-3">
				{isAuthenticated && <CommentInput onSubmit={handleSubmit} isPending={isPending} />}
				{!isAuthenticated && (
					<div>
						<Link className="text-primary" to={ROUTES.LOG_IN}>
							Authenticate
						</Link>{' '}
						to comment on posts
					</div>
				)}
				{comments.map((c) => {
					const respondedComment = comments.find(
						(resp) => resp.id === c.responseTo
					);
					return (
						<CommentBlock
							key={c.id}
							comment={c}
							respondedComment={respondedComment}
						/>
					);
				})}
			</div>
		</>
	);
};

export default CommentsSection;
