import { useForm } from 'react-hook-form';
import { signInSchema, type signInData } from './schemas/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from './components/ui/form';
import FormFieldGroup from './components/form-field';
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';
import useAuth from './hooks/useAuth';
import { handleSignIn } from './handlers/auth';
import { signOut } from 'firebase/auth';
import { auth } from './config/firebase';

function App() {
	const { user, authLoading } = useAuth();

	const form = useForm<signInData>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	return (
		<div>
			<h1>Hello {user ? user.displayName : 'world'}</h1>

			{authLoading && <p>Loading authentication...</p>}

			{user && <Button onClick={() => signOut(auth)}>Log out</Button>}

			{!user && (
				<div className="p-5 min-w-lg border border-primary rounded-xl">
					<h2>Log In</h2>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(handleSignIn)}
							className="flex flex-col gap-5"
						>
							<FormFieldGroup
								control={form.control}
								name="email"
								label="Email"
								render={(field) => (
									<Input
										placeholder="user@mail.com"
										{...field}
									/>
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
						</form>
					</Form>
				</div>
			)}
		</div>
	);
}

export default App;
