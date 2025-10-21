import FormFieldGroup from '@/components/form-field';
import Link from '@/components/link';
import PageTitle from '@/components/page-title';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { ROUTER_KEYS } from '@/constants/routes';
import { AUTH_FORM_FIELD } from '@/constants/validation/auth';
import { handleResetPassword } from '@/handlers/users';
import { resetPasswordSchema, type resetPasswordData } from '@/schemas/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const ResetPasswordPage = () => {
	const form = useForm<resetPasswordData>({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: {
			email: '',
		},
	});

	return (
		<div className="w-full h-screen flex justify-center items-center">
			<div className="p-5 min-w-lg border border-primary rounded-xl">
				<PageTitle title="Reset password" />
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleResetPassword)}
						className="flex flex-col gap-5"
					>
						<FormFieldGroup
							control={form.control}
							name={AUTH_FORM_FIELD.EMAIL.NAME}
							label={AUTH_FORM_FIELD.EMAIL.LABEL}
							render={(field) => (
								<Input placeholder={AUTH_FORM_FIELD.EMAIL.PLACEHOLDER} {...field} />
							)}
						/>
						<Button
							type="submit"
							className="flex-1"
							disabled={form.formState.isSubmitting}
						>
							Submit
							{form.formState.isSubmitting && <Spinner />}
						</Button>
						<hr />
						<div>
							<Link
								to={ROUTER_KEYS.LOG_IN}
								className="text-primary"
							>
								Back to Log In
							</Link>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
};

export default ResetPasswordPage;
