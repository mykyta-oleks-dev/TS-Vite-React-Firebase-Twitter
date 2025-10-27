import FormFieldGroup from '@/components/form-field';
import SubmitButton from '@/components/submit-button';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import type { Comment } from '@/types/Comment';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';

const commentSchema = z.object({
	text: z.string('Comment cannot be empty!'),
});

type commentData = z.infer<typeof commentSchema>;

const CommentInput = ({
	comment,
	onSubmit,
	isPending = false,
	onCancel,
}: {
	comment?: Comment;
	onSubmit: (text: string) => Promise<void>;
	isPending?: boolean;
	onCancel?: () => void;
}) => {
	const form = useForm<commentData>({
		resolver: zodResolver(commentSchema),
		defaultValues: {
			text: comment?.text ?? '',
		},
	});

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(async (data) => {
					await onSubmit(data.text);
					form.reset();
				})}
				className="flex flex-col gap-3"
			>
				<FormFieldGroup
					control={form.control}
					name="text"
					label={onCancel ? undefined : 'Comment'}
					render={(field) => (
						<Textarea
							placeholder="Your comment goes here"
							{...field}
						/>
					)}
				/>

				<div className="flex gap-3">
					<SubmitButton
						isSubmitting={form.formState.isSubmitting || isPending}
					>
						Submit
					</SubmitButton>
					<Button
						type="reset"
						variant="outline"
						onClick={() => form.reset()}
					>
						Reset
					</Button>
					{onCancel && (
						<Button
							type="button"
							variant="secondary"
							onClick={onCancel}
						>
							Cancel
						</Button>
					)}
				</div>
			</form>
		</Form>
	);
};

export default CommentInput;
