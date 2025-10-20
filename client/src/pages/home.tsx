import Link from '@/components/link';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import { handleSignOut } from '@/handlers/auth';
import useAuth from '@/hooks/useAuth';

const HomePage = () => {
	const { user, authLoading } = useAuth();

	return (
		<div>
			<h1>Hello {user ? `${user.firstName} ${user.lastName}` : 'world'}</h1>

			{authLoading && <p>Loading authentication...</p>}

			{user && <Button onClick={handleSignOut}>Log out</Button>}

			{!user && (
				<div className="flex flex-col gap-1">
					<Link to={ROUTES.LOG_IN}>Log In</Link>
					<Link to={ROUTES.SIGN_UP}>Sign Up</Link>
				</div>
			)}
		</div>
	);
};

export default HomePage;
