import { editProfileSchema, type editProfileData } from '@/schemas/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { User } from '@/types/User';
import { Form } from '@/components/ui/form';
import FormFieldGroup from '@/components/form-field';
import { ACCEPTED_IMAGE_TYPES, FORM_FIELD } from '@/constants/auth';
import { Input } from '@/components/ui/input';
import AvatarBig from '@/components/avatar-big';
import { useState } from 'react';
import DatePicker from '@/components/datepicker';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { handleUpdateUser } from '@/handlers/users';

const ProfileForm = ({ user }: { user: User }) => {
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
					handleUpdateUser(user, data)
				)}
			>
				<div className="col-span-2 lg:col-span-1 flex items-center gap-3">
					<AvatarBig src={avatarPreview ?? '/default-avatar.png'} />
					<FormFieldGroup
						className="flex-1"
						control={form.control}
						name="avatar"
						label={FORM_FIELD.AVATAR.LABEL}
						render={(field) => (
							<Input
								type="file"
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
					name="birthday"
					label={FORM_FIELD.BIRTHDAY.LABEL}
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
					name="firstName"
					label={FORM_FIELD.FIRST_NAME.LABEL}
					render={(field) => (
						<Input
							placeholder={FORM_FIELD.FIRST_NAME.PLACEHOLDER}
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
					name="lastName"
					label={FORM_FIELD.LAST_NAME.LABEL}
					render={(field) => (
						<Input
							placeholder={FORM_FIELD.LAST_NAME.PLACEHOLDER}
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
					name="location"
					label={FORM_FIELD.LOCATION.LABEL}
					render={(field) => (
						<Input
							placeholder={FORM_FIELD.LOCATION.PLACEHOLDER}
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
					name="about"
					label={FORM_FIELD.ABOUT.LABEL}
					render={(field) => (
						<Textarea
							{...field}
							placeholder={FORM_FIELD.ABOUT.PLACEHOLDER}
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

				<Button
					type="submit"
					className="col-span-1"
					disabled={form.formState.isSubmitting}
				>
					Submit {form.formState.isSubmitting && <Spinner />}
				</Button>
				<Button type="reset" variant="outline" className="col-span-1">
					Reset
				</Button>
			</form>
		</Form>
	);
};

export default ProfileForm;
