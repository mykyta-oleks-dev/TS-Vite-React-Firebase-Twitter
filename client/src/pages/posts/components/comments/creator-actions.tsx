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

const CommentCreatorActions = ({
	comment,
	onEditClick,
}: {
	comment: Comment;
	onEditClick: () => void;
}) => {
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

			<AlertDialog>
				<AlertDialogTrigger asChild>
					<Button
						size="icon"
						variant="ghost"
						className="rounded-full text-destructive hover:text-destructive"
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
							onClick={() =>
								console.log(`deleted comment ${comment.id}`)
							}
							variant="destructive"
						>
							Continue
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
};

export default CommentCreatorActions;
