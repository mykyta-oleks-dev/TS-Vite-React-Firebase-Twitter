import { Button } from '@/components/ui/button';
import type { Comment } from '@/types/Comment';
import { PenLineIcon, Trash2Icon } from 'lucide-react';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '../../../../components/ui/alert-dialog';
import useCommentsDeleteMutation from '@/hooks/comment/useCommentsDeleteMutation';
import type { QueryKey } from '@tanstack/react-query';
import { useState } from 'react';
import { Spinner } from '@/components/ui/spinner';

const CommentCreatorActions = ({
	comment,
	onEditClick,
	queryKey,
}: {
	comment: Comment;
	onEditClick: () => void;
	queryKey: QueryKey;
}) => {
	const [open, setOpen] = useState(false);
	const { mutateAsync, isPending } = useCommentsDeleteMutation(queryKey);

	return (
		<>
			<Button
				size="icon"
				variant="ghost"
				className="rounded-full text-primary hover:text-primary ml-auto"
				onClick={onEditClick}
			>
				<PenLineIcon />
			</Button>

			<AlertDialog open={open}>
				<AlertDialogTrigger asChild>
					<Button
						size="icon"
						variant="ghost"
						className="rounded-full text-destructive hover:text-destructive"
						onClick={() => setOpen(true)}
					>
						<Trash2Icon />
					</Button>
				</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Are you absolutely sure?
						</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently
							delete this comment without recovery.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={async () => {
								await mutateAsync({
									original: comment,
									postId: comment.postId,
								});
								setOpen(false);
							}}
							variant="destructive"
							disabled={isPending}
						>
							Continue {isPending && <Spinner />}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
};

export default CommentCreatorActions;
