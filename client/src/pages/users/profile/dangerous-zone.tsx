import FormFieldGroup from '@/components/form-field';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { FORM_FIELD } from '@/constants/auth';
import { handleChangePassword, handleDeleteAccount } from '@/handlers/users';
import { changePasswordSchema, type changePasswordData } from '@/schemas/auth';
import useUser from '@/stores/authStore';
import type { User } from '@/types/User';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const PasswordChange = ({ user }: { user: User }) => {
	const reset = useUser((s) => s.reset);

	const form = useForm<changePasswordData>({
		resolver: zodResolver(changePasswordSchema),
		defaultValues: {
			oldPassword: '',
			password: '',
			confirmPassword: '',
		},
	});

	return (
		<div className="flex flex-col gap-5">
			<div>
				<h3 className="mb-3 font-semibold text-xl">
					Change your password
				</h3>
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
									placeholder={
										FORM_FIELD.PASSWORD.PLACEHOLDER
									}
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
									placeholder={
										FORM_FIELD.PASSWORD.PLACEHOLDER
									}
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
									placeholder={
										FORM_FIELD.PASSWORD.PLACEHOLDER
									}
									type="password"
								/>
							)}
						/>
						<Button
							type="submit"
							variant="destructive"
							className='md:w-max'
							disabled={form.formState.isSubmitting}
						>
							Change Password
						</Button>
					</form>
				</Form>
			</div>

			<hr />

			<div>
				<h3 className="mb-3 font-semibold text-xl">
					Delete your account
				</h3>
				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button variant="destructive">Delete account</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>
								Are you absolutely sure?
							</AlertDialogTitle>
							<AlertDialogDescription>
								This action cannot be undone. This will
								permanently delete your account and remove your
								data from our servers.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction
								onClick={() => handleDeleteAccount(user.avatar, reset)}
								variant='destructive'
							>
								Continue
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</div>
		</div>
	);
};

export default PasswordChange;
