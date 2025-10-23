import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import { PenLineIcon, Trash2Icon } from 'lucide-react';
import Link from '../link';
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
} from '../ui/alert-dialog';
import usePostDeleteMutation from '@/hooks/usePostDeleteMutation';
import type { Post } from '@/types/Post';

const PostCreatorActions = ({ post }: { post: Post }) => {
	const { mutate } = usePostDeleteMutation();

	return (
		<>
			<Button
				size="icon"
				variant="ghost"
				className="rounded-full text-primary hover:text-primary ml-auto"
				asChild
			>
				<Link to={ROUTES.POST_EDIT(post.id)}>
					<PenLineIcon />
				</Link>
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
							delete this post without recovery.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => mutate(post)}
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

export default PostCreatorActions;
