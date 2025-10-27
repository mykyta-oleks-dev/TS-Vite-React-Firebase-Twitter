import FormFieldGroup from '@/components/form-field';
import SubmitButton from '@/components/submit-button';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ACCEPTED_IMAGE_TYPES } from '@/constants/validation/common';
import { POSTS_FORM_FIELDS } from '@/constants/validation/posts';
import { postSchema, type postData } from '@/schemas/posts';
import type { Post } from '@/types/Post';
import { zodResolver } from '@hookform/resolvers/zod';
import { XIcon } from 'lucide-react';
import { useState, type Dispatch, type SetStateAction } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';

const PostForm = ({
	post,
	onSubmit,
	setWithPhoto,
}: {
	post?: Post;
	onSubmit: SubmitHandler<postData>;
	setWithPhoto: Dispatch<SetStateAction<boolean>>;
}) => {
	const [preview, setPreview] = useState<string | null>(post?.photo ?? null);

	const form = useForm<postData>({
		resolver: zodResolver(postSchema),
		defaultValues: {
			photo: undefined,
			content: post?.content ?? '',
			title: post?.title ?? '',
		},
	});

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
			>
				<div className="col-span-1 flex flex-col gap-5 items-center">
					<div className="w-4/5 relative">
						<img
							className="w-full"
							src={preview ?? '/placeholder-image.png'}
							alt="Post's content"
						/>
						{preview && (
							<Button
								className="absolute top-3 right-3 rounded-full"
								size="icon"
								variant="outline"
								onClick={() => {
									form.resetField('photo')
										
									setPreview(null);

									setWithPhoto(false);
								}}
							>
								<XIcon />
							</Button>
						)}
					</div>
					<FormFieldGroup
						className="w-full"
						control={form.control}
						name={POSTS_FORM_FIELDS.PHOTO.NAME}
						label={POSTS_FORM_FIELDS.PHOTO.LABEL}
						render={(field) => (
							<Input
								type={POSTS_FORM_FIELDS.PHOTO.TYPE}
								accept={[...ACCEPTED_IMAGE_TYPES].join(',')}
								onChange={(e) => {
									const file = e.target.files?.[0];
									if (file) {
										field.onChange(file);

										const reader = new FileReader();
										reader.onloadend = () => {
											setPreview(reader.result as string);
										};
										reader.readAsDataURL(file);

										setWithPhoto(true);
									} else {
										field.onChange(undefined);
										
										setPreview(null);

										setWithPhoto(false);
									}
								}}
								onBlur={field.onBlur}
								name={field.name}
								ref={field.ref}
							/>
						)}
					/>
				</div>

				<div className="col-span-1 lg:col-span-2 flex flex-col gap-5">
					<FormFieldGroup
						control={form.control}
						name={POSTS_FORM_FIELDS.TITLE.NAME}
						label={POSTS_FORM_FIELDS.TITLE.LABEL}
						render={(field) => (
							<Input
								required
								placeholder={
									POSTS_FORM_FIELDS.TITLE.PLACEHOLDER
								}
								{...field}
								value={
									field.value instanceof File
										? undefined
										: field.value
								}
							/>
						)}
					/>

					<FormFieldGroup
						className="flex-1 flex flex-col"
						control={form.control}
						name={POSTS_FORM_FIELDS.CONTENT.NAME}
						label={POSTS_FORM_FIELDS.CONTENT.LABEL}
						render={(field) => (
							<Textarea
								required
								className="min-h-32 flex-1 resize-none"
								placeholder={
									POSTS_FORM_FIELDS.CONTENT.PLACEHOLDER
								}
								{...field}
								value={
									field.value instanceof File
										? undefined
										: field.value
								}
							/>
						)}
					/>
				</div>

				<div className="col-span-full flex gap-5">
					<SubmitButton
						className="flex-1"
						isSubmitting={form.formState.isSubmitting}
					>
						Submit
					</SubmitButton>
					<Button type="reset" variant="outline" className="flex-1">
						Reset
					</Button>
				</div>
			</form>
		</Form>
	);
};

export default PostForm;
