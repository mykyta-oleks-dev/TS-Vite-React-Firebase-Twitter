import AvatarBig from '@/components/avatar-big';
import DatePicker from '@/components/datepicker';
import FormFieldGroup from '@/components/form-field';
import SubmitButton from '@/components/submit-button';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AUTH_FORM_FIELDS } from '@/constants/validation/auth';
import { ACCEPTED_IMAGE_TYPES } from '@/constants/validation/common';
import { handleUpdateUser } from '@/handlers/users';
import { editProfileSchema, type editProfileData } from '@/schemas/auth';
import useUser from '@/stores/authStore';
import type { User } from '@/types/User';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

const ProfileForm = ({ user }: { user: User }) => {
	const updateUser = useUser((s) => s.updateUser);

	const [avatarPreview, setAvatarPreview] = useState<string | null>(
		user.avatar
	);

	const form = useForm<editProfileData>({
		resolver: zodResolver(editProfileSchema),
		defaultValues: {
			avatar: undefined,
			birthday: user.birthday,
			firstName: user.firstName,
			lastName: user.lastName,
			location: user.location ?? '',
			about: user.about ?? '',
		},
	});

	return (
		<Form {...form}>
			<form
				className="grid grid-cols-2 gap-3"
				onSubmit={form.handleSubmit((data) =>
					handleUpdateUser(user, data, (data, avatar) => {
						updateUser({
							...user,
							...data,
							avatar,
						});
					})
				)}
			>
				<div className="col-span-2 lg:col-span-1 flex items-center gap-3">
					<AvatarBig src={avatarPreview ?? '/default-avatar.png'} />
					<FormFieldGroup
						className="flex-1"
						control={form.control}
						name={AUTH_FORM_FIELDS.AVATAR.NAME}
						label={AUTH_FORM_FIELDS.AVATAR.LABEL}
						render={(field) => (
							<Input
								type={AUTH_FORM_FIELDS.AVATAR.TYPE}
								accept={[...ACCEPTED_IMAGE_TYPES].join(',')}
								onChange={(e) => {
									const file = e.target.files?.[0];
									if (file) {
										field.onChange(file);

										const reader = new FileReader();
										reader.onloadend = () => {
											setAvatarPreview(
												reader.result as string
											);
										};
										reader.readAsDataURL(file);
									}
								}}
								onBlur={field.onBlur}
								name={field.name}
								ref={field.ref}
							/>
						)}
					/>
				</div>

				<FormFieldGroup
					className="col-span-2 lg:col-span-1"
					control={form.control}
					name={AUTH_FORM_FIELDS.BIRTHDAY.NAME}
					label={AUTH_FORM_FIELDS.BIRTHDAY.LABEL}
					render={(field) => (
						<DatePicker
							className="flex-1"
							date={field.value as Date}
							setDate={field.onChange}
							disabled={(date) => date > new Date()}
						/>
					)}
				/>
				<FormFieldGroup
					className="col-span-2 md:col-span-1"
					control={form.control}
					name={AUTH_FORM_FIELDS.FIRST_NAME.NAME}
					label={AUTH_FORM_FIELDS.FIRST_NAME.LABEL}
					render={(field) => (
						<Input
							placeholder={
								AUTH_FORM_FIELDS.FIRST_NAME.PLACEHOLDER
							}
							{...field}
							value={
								field.value instanceof File ||
								field.value instanceof Date
									? undefined
									: field.value
							}
						/>
					)}
				/>

				<FormFieldGroup
					className="col-span-2 md:col-span-1"
					control={form.control}
					name={AUTH_FORM_FIELDS.LAST_NAME.NAME}
					label={AUTH_FORM_FIELDS.LAST_NAME.LABEL}
					render={(field) => (
						<Input
							placeholder={AUTH_FORM_FIELDS.LAST_NAME.PLACEHOLDER}
							{...field}
							value={
								field.value instanceof File ||
								field.value instanceof Date
									? undefined
									: field.value
							}
						/>
					)}
				/>

				<FormFieldGroup
					className="col-span-2"
					control={form.control}
					name={AUTH_FORM_FIELDS.LOCATION.NAME}
					label={AUTH_FORM_FIELDS.LOCATION.LABEL}
					render={(field) => (
						<Input
							placeholder={AUTH_FORM_FIELDS.LOCATION.PLACEHOLDER}
							{...field}
							value={
								field.value instanceof File ||
								field.value instanceof Date
									? undefined
									: field.value
							}
						/>
					)}
				/>

				<FormFieldGroup
					className="col-span-2"
					control={form.control}
					name={AUTH_FORM_FIELDS.ABOUT.NAME}
					label={AUTH_FORM_FIELDS.ABOUT.LABEL}
					render={(field) => (
						<Textarea
							{...field}
							placeholder={AUTH_FORM_FIELDS.ABOUT.PLACEHOLDER}
							value={
								field.value instanceof File ||
								field.value instanceof Date
									? undefined
									: field.value
							}
							className="resize-none min-h-24"
						/>
					)}
				/>

				<SubmitButton
					className="col-span-1"
					isSubmitting={form.formState.isSubmitting}
				>
					Submit
				</SubmitButton>
				<Button type="reset" variant="outline" className="col-span-1">
					Reset
				</Button>
			</form>
		</Form>
	);
};

export default ProfileForm;
