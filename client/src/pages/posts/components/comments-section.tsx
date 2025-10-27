import CommentBlock from '@/components/comment';
import type { Comment } from '@/types/Comment';

const CommentsSection = ({ comments }: { comments: Comment[] }) => {
	return (
		<>
			<hr />
			<div className="flex flex-col gap-3">
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
