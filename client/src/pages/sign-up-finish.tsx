import AvatarBig from '@/components/avatar-big';
import DatePicker from '@/components/datepicker';
import FormFieldGroup from '@/components/form-field';
import Link from '@/components/link';
import PageTitle from '@/components/page-title';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { ACCEPTED_IMAGE_TYPES, FORM_FIELD } from '@/constants/auth';
import { ROUTES } from '@/constants/routes';
import { handleSignUpFinish } from '@/handlers/auth';
import { signUpFinishSchema, type signUpFinishData } from '@/schemas/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

const FinishSignUpPage = () => {
	const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

	const form = useForm<signUpFinishData>({
		resolver: zodResolver(signUpFinishSchema),
		defaultValues: {},
	});

	return (
		<div className="w-full min-h-screen p-5 flex justify-center items-center">
			<div className="p-5 min-w-2xl border border-primary rounded-xl">
				<PageTitle
					title="Crucial user info"
					sub="Last step in the sign up process..."
				/>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSignUpFinish)}
						className="flex flex-col gap-3"
					>
						<div className="flex items-center gap-3">
							<AvatarBig
								src={avatarPreview ?? '/default-avatar.png'}
							/>
							<FormFieldGroup
								className="flex-1"
								control={form.control}
								name="avatar"
								label={FORM_FIELD.AVATAR.LABEL}
								render={(field) => (
									<Input
										type="file"
										accept={[...ACCEPTED_IMAGE_TYPES].join(
											','
										)}
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

						<div className="flex gap-3">
							<FormFieldGroup
								className="flex-1"
								control={form.control}
								name="firstName"
								label={FORM_FIELD.FIRST_NAME.LABEL}
								render={(field) => (
									<Input
										placeholder={
											FORM_FIELD.FIRST_NAME.PLACEHOLDER
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
								className="flex-1"
								control={form.control}
								name="lastName"
								label={FORM_FIELD.LAST_NAME.LABEL}
								render={(field) => (
									<Input
										placeholder={
											FORM_FIELD.LAST_NAME.PLACEHOLDER
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
						</div>

						<FormFieldGroup
							control={form.control}
							name="birthday"
							label={FORM_FIELD.BIRTHDAY.LABEL}
							render={(field) => (
								<DatePicker
									className="flex-1"
									date={field.value as Date}
									setDate={field.onChange}
								/>
							)}
						/>

						<div className="flex gap-3">
							<Button
								type="submit"
								className="flex-1"
								disabled={form.formState.isSubmitting}
							>
								Sign Up{' '}
								{form.formState.isSubmitting && <Spinner />}
							</Button>
							<Button
								type="reset"
								variant="outline"
								className="flex-1"
							>
								Reset
							</Button>
						</div>
						<hr />
						<div>
							Already have an account?{' '}
							<Link to={ROUTES.LOG_IN}>Log In</Link>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
};

export default FinishSignUpPage;
