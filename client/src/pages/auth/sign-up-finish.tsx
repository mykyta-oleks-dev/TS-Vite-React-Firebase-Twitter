import AvatarBig from '@/components/avatar-big';
import DatePicker from '@/components/datepicker';
import FormFieldGroup from '@/components/form-field';
import PageLoader from '@/components/page-loader';
import PageTitle from '@/components/page-title';
import SubmitButton from '@/components/submit-button';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ROUTES } from '@/constants/routes';
import { AUTH_FORM_FIELDS } from '@/constants/validation/auth';
import { ACCEPTED_IMAGE_TYPES } from '@/constants/validation/common';
import { handleSignUpFinish } from '@/handlers/users';
import useAuth from '@/hooks/useAuth';
import { signUpFinishSchema, type signUpFinishData } from '@/schemas/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate } from 'react-router';
import AuthPageWrapper from './components/wrapper';

const FinishSignUpPage = () => {
	const { isAuthenticated, authLoading } = useAuth();

	const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

	const form = useForm<signUpFinishData>({
		resolver: zodResolver(signUpFinishSchema),
		defaultValues: {
			avatar: undefined,
			birthday: new Date(),
			firstName: '',
			lastName: '',
		},
	});

	if (authLoading) return <PageLoader />;

	if (!isAuthenticated) return <Navigate to={ROUTES.LOG_IN} />;

	return (
		<AuthPageWrapper>
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

					<div className="flex gap-3">
						<FormFieldGroup
							className="flex-1"
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
							className="flex-1"
							control={form.control}
							name={AUTH_FORM_FIELDS.LAST_NAME.NAME}
							label={AUTH_FORM_FIELDS.LAST_NAME.LABEL}
							render={(field) => (
								<Input
									placeholder={
										AUTH_FORM_FIELDS.LAST_NAME.PLACEHOLDER
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

					<div className="flex gap-3">
						<SubmitButton
							className="flex-1"
							isSubmitting={form.formState.isSubmitting}
						>
							Submit
						</SubmitButton>
						<Button
							type="reset"
							variant="outline"
							className="flex-1"
						>
							Reset
						</Button>
					</div>
				</form>
			</Form>
		</AuthPageWrapper>
	);
};

export default FinishSignUpPage;
