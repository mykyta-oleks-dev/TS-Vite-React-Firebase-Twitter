import FormFieldGroup from '@/components/form-field';
import Link from '@/components/link';
import PageTitle from '@/components/page-title';
import SubmitButton from '@/components/submit-button';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { APP_NAME, ROUTER_KEYS } from '@/constants/routes';
import { AUTH_FORM_FIELDS } from '@/constants/validation/auth';
import { handleResetPassword } from '@/handlers/users';
import { resetPasswordSchema, type resetPasswordData } from '@/schemas/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import AuthPageWrapper from './components/wrapper';

const ResetPasswordPage = () => {
	const form = useForm<resetPasswordData>({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: {
			email: '',
		},
	});

	return (
		<AuthPageWrapper>
			<title>{`${APP_NAME} - Resetting password`}</title>
			<PageTitle title="Reset password" />
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(handleResetPassword)}
					className="flex flex-col gap-5"
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
					<SubmitButton
						className="flex-1"
						isSubmitting={form.formState.isSubmitting}
					>
						Submit
					</SubmitButton>
					<hr />
					<div>
						<Link to={ROUTER_KEYS.LOG_IN} className="text-primary">
							Back to Log In
						</Link>
					</div>
				</form>
			</Form>
		</AuthPageWrapper>
	);
};

export default ResetPasswordPage;
