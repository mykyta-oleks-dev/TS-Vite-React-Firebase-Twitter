import FormFieldGroup from '@/components/form-field';
import GoogleAuthButton from '@/components/google-auth';
import Link from '@/components/link';
import PageTitle from '@/components/page-title';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ROUTES } from '@/constants/routes';
import { handleLogIn } from '@/handlers/auth';
import { logInSchema, type logInData } from '@/schemas/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const LogInPage = () => {
	const form = useForm<logInData>({
		resolver: zodResolver(logInSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	return (
		<div className="w-full h-screen flex justify-center items-center">
			<div className="p-5 min-w-lg border border-primary rounded-xl">
				<PageTitle title="Log In" />
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleLogIn)}
						className="flex flex-col gap-5"
					>
						<FormFieldGroup
							control={form.control}
							name="email"
							label="Email"
							render={(field) => (
								<Input placeholder="user@mail.com" {...field} />
							)}
						/>
						<FormFieldGroup
							control={form.control}
							name="password"
							label="Password"
							render={(field) => (
								<Input
									placeholder=""
									{...field}
									type="password"
								/>
							)}
						/>
						<div className="flex gap-5">
							<Button type="submit" className="flex-1">
								Log In
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
						<GoogleAuthButton isLogin />
						<div>
							Don&apos;t have an account?{' '}
							<Link to={ROUTES.SIGN_UP} className='text-primary'>Sign Up</Link>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
};

export default LogInPage;
