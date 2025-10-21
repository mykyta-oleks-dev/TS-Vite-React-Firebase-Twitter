import AvatarBig from '@/components/avatar-big';
import DatePicker from '@/components/datepicker';
import FormFieldGroup from '@/components/form-field';
import GoogleAuthButton from '@/components/google-auth';
import Link from '@/components/link';
import PageTitle from '@/components/page-title';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { AUTH_FORM_FIELD } from '@/constants/validation/auth';
import { ACCEPTED_IMAGE_TYPES } from '@/constants/validation/common';
import { ROUTES } from '@/constants/routes';
import { handleSignUp } from '@/handlers/users';
import { signUpSchema, type signUpData } from '@/schemas/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

const SignUpPage = () => {
	const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

	const form = useForm<signUpData>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			avatar: undefined,
			birthday: new Date(),
			firstName: '',
			lastName: '',
			email: '',
			password: '',
			confirmPassword: '',
		},
	});

	return (
		<div className="w-full min-h-screen p-5 flex justify-center items-center">
			<div className="p-5 md:min-w-2xl border border-primary rounded-xl">
				<PageTitle title="Sign Up" />
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSignUp)}
						className="flex flex-col gap-3"
					>
						<div className="flex items-center gap-3">
							<AvatarBig
								src={avatarPreview ?? '/default-avatar.png'}
							/>
							<FormFieldGroup
								className="flex-1"
								control={form.control}
								name={AUTH_FORM_FIELD.AVATAR.NAME}
								label={AUTH_FORM_FIELD.AVATAR.LABEL}
								render={(field) => (
									<Input
										type={AUTH_FORM_FIELD.AVATAR.TYPE}
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
								name={AUTH_FORM_FIELD.FIRST_NAME.NAME}
								label={AUTH_FORM_FIELD.FIRST_NAME.LABEL}
								render={(field) => (
									<Input
										placeholder={
											AUTH_FORM_FIELD.FIRST_NAME
												.PLACEHOLDER
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
								name={AUTH_FORM_FIELD.LAST_NAME.NAME}
								label={AUTH_FORM_FIELD.LAST_NAME.LABEL}
								render={(field) => (
									<Input
										placeholder={
											AUTH_FORM_FIELD.LAST_NAME
												.PLACEHOLDER
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
							name={AUTH_FORM_FIELD.BIRTHDAY.NAME}
							label={AUTH_FORM_FIELD.BIRTHDAY.LABEL}
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
							control={form.control}
							name={AUTH_FORM_FIELD.EMAIL.NAME}
							label={AUTH_FORM_FIELD.EMAIL.LABEL}
							render={(field) => (
								<Input
									placeholder={
										AUTH_FORM_FIELD.EMAIL.PLACEHOLDER
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

						<div className="flex gap-3 flex-col md:flex-row">
							<FormFieldGroup
								className="flex-1"
								control={form.control}
								name={AUTH_FORM_FIELD.PASSWORD.NAME}
								label={AUTH_FORM_FIELD.PASSWORD.LABEL}
								render={(field) => (
									<Input
										placeholder={
											AUTH_FORM_FIELD.PASSWORD.PLACEHOLDER
										}
										{...field}
										type={AUTH_FORM_FIELD.PASSWORD.TYPE}
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
								name={AUTH_FORM_FIELD.CONFIRM_PASSWORD.NAME}
								label={AUTH_FORM_FIELD.CONFIRM_PASSWORD.LABEL}
								render={(field) => (
									<Input
										placeholder={
											AUTH_FORM_FIELD.PASSWORD.PLACEHOLDER
										}
										{...field}
										type={AUTH_FORM_FIELD.PASSWORD.TYPE}
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
						<GoogleAuthButton />
						<div>
							Already have an account?{' '}
							<Link to={ROUTES.LOG_IN} className="text-primary">
								Log In
							</Link>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
};

export default SignUpPage;
