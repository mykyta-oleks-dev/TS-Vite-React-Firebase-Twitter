import FormFieldGroup from '@/components/form-field';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { FORM_FIELD } from '@/constants/auth';
import { handleChangePassword } from '@/handlers/users';
import { changePasswordSchema, type changePasswordData } from '@/schemas/auth';
import type { User } from '@/types/User';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const PasswordChange = ({ user }: { user: User }) => {
	const form = useForm<changePasswordData>({
		resolver: zodResolver(changePasswordSchema),
		defaultValues: {
			oldPassword: '',
			password: '',
			confirmPassword: '',
		},
	});
	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit((data) =>
					handleChangePassword(user.email, data)
				)}
				className="flex flex-col gap-3"
			>
				<FormFieldGroup
					control={form.control}
					name="oldPassword"
					label={FORM_FIELD.OLD_PASSWORD.LABEL}
					render={(field) => (
						<Input
							{...field}
							placeholder={FORM_FIELD.PASSWORD.PLACEHOLDER}
							type="password"
						/>
					)}
				/>

				<FormFieldGroup
					control={form.control}
					name="password"
					label={FORM_FIELD.PASSWORD.LABEL}
					render={(field) => (
						<Input
							{...field}
							placeholder={FORM_FIELD.PASSWORD.PLACEHOLDER}
							type="password"
						/>
					)}
				/>

				<FormFieldGroup
					control={form.control}
					name="confirmPassword"
					label={FORM_FIELD.CONFIRM_PASSWORD.LABEL}
					render={(field) => (
						<Input
							{...field}
							placeholder={FORM_FIELD.PASSWORD.PLACEHOLDER}
							type="password"
						/>
					)}
				/>

				<Button
					type="submit"
					variant="destructive"
					disabled={form.formState.isSubmitting}
				>
					Change Password
				</Button>
			</form>
		</Form>
	);
};

export default PasswordChange;
