import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import useCommentsEditMutation from '@/hooks/comment/useCommentsEditMutation';
import useCommentsWriteMutation from '@/hooks/comment/useCommentsWriteMutation';
import { cn } from '@/lib/utils';
import useUser from '@/stores/authStore';
import type { Comment } from '@/types/Comment';
import type { QueryKey } from '@tanstack/react-query';
import { useState, type PropsWithChildren } from 'react';
import Link from '../../../../components/link';
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from '../../../../components/ui/avatar';
import CommentInput from './comment-input';
import CommentCreatorActions from './creator-actions';

const CommentBlock = ({
	comment,
	respondedComment,
	queryKey,
}: {
	comment: Comment;
	respondedComment?: Comment;
	queryKey: QueryKey;
}) => {
	const [isReplying, setIsReplying] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const userData = useUser((s) => s.userData);

	const { mutateAsync: mutateAsyncEdit, isPending: isPendingEdit } =
		useCommentsEditMutation(queryKey);
	const { mutateAsync: mutateAsyncReply, isPending: isPendingReply } =
		useCommentsWriteMutation(queryKey);

	const content = comment.text
		.split('\n')
		.map((p, idx) => <p key={`post-${comment.id}-${idx}`}>{p}</p>);

	const respondedToContent = respondedComment?.text.split('\n')[0];

	const handleEditClick = () => {
		setIsEditing(true);
	};

	const handleEditCancel = () => {
		setIsEditing(false);
	};

	const handleReplyClick = () => {
		setIsReplying(true);
	};

	const handleReplyCancel = () => {
		setIsReplying(false);
	};

	const handleSubmitEdit = async (text: string) => {
		await mutateAsyncEdit({
			postId: comment.postId,
			text,
			original: comment,
		});
		setIsEditing(false);
	};

	const handleSubmitReply = async (text: string) => {
		await mutateAsyncReply({
			postId: comment.postId,
			text,
			respondedToId: comment.id,
		});
		setIsReplying(false);
	};

	return (
		<div
			id={comment.id}
			className={cn(
				'p-3 flex flex-col gap-3 border rounded-md items-start',
				comment.isDeleted
					? 'bg-gray-200 dark:bg-gray-800'
					: 'transition hover:border-primary'
			)}
		>
			<UserData comment={comment} className="flex gap-3 items-center">
				<Avatar className="border border-gray-500">
					<AvatarImage
						src={comment.userAvatar ?? '/default-avatar.png'}
					/>
					<AvatarFallback>
						{comment.userName.substring(0, 2)}
					</AvatarFallback>
				</Avatar>
				<div className="flex flex-col items-start">
					<span className="text-sm font-semibold">
						{comment.userName}
					</span>
					<time
						className="text-xs text-gray-500 no-underline hover:no-underline"
						dateTime={comment.createdAt.toISOString()}
					>
						{comment.createdAt.toLocaleDateString('en-US', {
							year: 'numeric',
							month: 'long',
							day: 'numeric',
							hour: 'numeric',
							minute: 'numeric',
							second: 'numeric',
						})}
					</time>
				</div>
			</UserData>

			<hr className="w-full" />

			<div className="text-sm flex flex-col gap-2 w-full">
				{respondedComment && (
					<Link
						to={`#${respondedComment.id}`}
						className="p-3 bg-gray-300 dark:bg-gray-700"
						onClick={(e) => {
							e.preventDefault();
							document
								.getElementById(respondedComment.id)
								?.scrollIntoView();
						}}
					>
						<p className="text-xs text-ellipsis line-clamp-2 overflow-clip">
							{respondedToContent}
						</p>
					</Link>
				)}
				{isEditing ? (
					<CommentInput
						onSubmit={handleSubmitEdit}
						comment={comment}
						isPending={isPendingEdit}
						onCancel={handleEditCancel}
					/>
				) : (
					<div className="flex flex-col gap-2">{content}</div>
				)}

				<hr />

				<div className="flex gap-3">
					{!comment.isDeleted && (
						<Button variant="link" onClick={handleReplyClick}>
							Reply
						</Button>
					)}
					{userData?.user.id === comment.userId && (
						<CommentCreatorActions
							comment={comment}
							onEditClick={handleEditClick}
							queryKey={queryKey}
						/>
					)}
				</div>

				{isReplying && (
					<>
						<hr />
						<CommentInput
							isPending={isPendingReply}
							onSubmit={handleSubmitReply}
							onCancel={handleReplyCancel}
						/>
					</>
				)}
			</div>
		</div>
	);
};

const UserData = ({
	comment,
	children,
	className,
}: PropsWithChildren<{ comment: Comment; className?: string }>) => {
	if (comment.isDeleted) {
		return <div className={className}>{children}</div>;
	} else {
		return (
			<Link
				to={ROUTES.PROFILE_VIEW(comment.userId)}
				className={className}
			>
				{children}
			</Link>
		);
	}
};

export default CommentBlock;
