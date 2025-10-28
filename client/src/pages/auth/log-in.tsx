import FormFieldGroup from '@/components/form-field';
import GoogleAuthButton from '@/components/google-auth';
import Link from '@/components/link';
import PageTitle from '@/components/page-title';
import SubmitButton from '@/components/submit-button';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { APP_NAME, ROUTES } from '@/constants/routes';
import { AUTH_FORM_FIELDS } from '@/constants/validation/auth';
import { handleLogIn } from '@/handlers/users';
import { logInSchema, type logInData } from '@/schemas/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import AuthPageWrapper from './components/wrapper';

const LogInPage = () => {
	const form = useForm<logInData>({
		resolver: zodResolver(logInSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	return (
		<AuthPageWrapper>
			<title>{`${APP_NAME} - Log In`}</title>
			<PageTitle title="Log In" />
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(handleLogIn)}
					className="flex flex-col gap-3"
				>
					<FormFieldGroup
						control={form.control}
						name={AUTH_FORM_FIELDS.EMAIL.NAME}
						label={AUTH_FORM_FIELDS.EMAIL.LABEL}
						render={(field) => (
							<Input
								placeholder={AUTH_FORM_FIELDS.EMAIL.PLACEHOLDER}
								{...field}
							/>
						)}
					/>
					<div className="flex flex-col gap-1">
						<FormFieldGroup
							control={form.control}
							name={AUTH_FORM_FIELDS.PASSWORD.NAME}
							label={AUTH_FORM_FIELDS.PASSWORD.LABEL}
							render={(field) => (
								<Input
									placeholder={
										AUTH_FORM_FIELDS.PASSWORD.PLACEHOLDER
									}
									{...field}
									type={AUTH_FORM_FIELDS.PASSWORD.TYPE}
								/>
							)}
						/>

						<Link
							to={ROUTES.RESET_PASSWORD}
							className="text-primary"
						>
							Forgot the password?
						</Link>
					</div>

					<div className="flex sm:flex-row flex-col gap-3">
						<SubmitButton
							className="flex-1"
							isSubmitting={form.formState.isSubmitting}
						>
							Log In
						</SubmitButton>
						<Button
							type="reset"
							variant="outline"
							className="flex-1"
						>
							Reset
						</Button>
					</div>
					<hr />
					<GoogleAuthButton isLogin />
					<div>
						Don&apos;t have an account?{' '}
						<Link to={ROUTES.SIGN_UP} className="text-primary">
							Sign Up
						</Link>
					</div>
				</form>
			</Form>
		</AuthPageWrapper>
	);
};

export default LogInPage;
