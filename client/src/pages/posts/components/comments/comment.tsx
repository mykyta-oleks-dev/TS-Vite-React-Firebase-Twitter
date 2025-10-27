import { ROUTES } from '@/constants/routes';
import type { Comment } from '@/types/Comment';
import Link from '../../../../components/link';
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from '../../../../components/ui/avatar';
import { useState, type PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';
import useUser from '@/stores/authStore';
import CommentCreatorActions from './creator-actions';
import useCommentsEditMutation from '@/hooks/comment/useCommentsEditMutation';
import type { QueryKey } from '@tanstack/react-query';
import CommentInput from './comment-input';

const CommentBlock = ({
	comment,
	respondedComment,
	queryKey,
}: {
	comment: Comment;
	respondedComment?: Comment;
	queryKey: QueryKey;
}) => {
	const [isEditing, setIsEditing] = useState(false);
	const userData = useUser((s) => s.userData);

	const { mutateAsync, isPending } = useCommentsEditMutation(queryKey);

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

	const handleSubmit = async (text: string) => {
		await mutateAsync({ postId: comment.postId, text, original: comment });
		setIsEditing(false);
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
						className="p-3 bg-gray-300 dark:bg-gray-700 line-clamp-2 text-xs"
						onClick={(e) => {
							e.preventDefault();

							document
								.getElementById(respondedComment.id)
								?.scrollIntoView();
						}}
					>
						{respondedToContent}
					</Link>
				)}
				{isEditing ? (
					<CommentInput
						onSubmit={handleSubmit}
						comment={comment}
						isPending={isPending}
						onCancel={handleEditCancel}
					/>
				) : (
					<div className="flex flex-col gap-2">{content}</div>
				)}

				<hr />

				<div className="flex gap-3">
					{userData?.user.id === comment.userId && (
						<CommentCreatorActions
							comment={comment}
							onEditClick={handleEditClick}
						/>
					)}
				</div>
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
