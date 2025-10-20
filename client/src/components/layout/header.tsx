import { ROUTER_KEYS } from '@/constants/routes';
import { handleSignOut } from '@/handlers/users';
import type { User } from '@/types/User';
import { BirdIcon } from 'lucide-react';
import Link from '../link';
import { Button } from '../ui/button';
import Navigation from './navigation';

const Header = ({ user }: { user?: User }) => {
	return (
		<header className="flex h-15 items-center gap-5 px-5 py-5 mb-5 bg-primary text-primary-foreground">
			<div>
				<BirdIcon />
			</div>
			<Navigation user={user} />
			<div className="ml-auto flex items-center gap-2">
				{user && (
					<>
						<h6>Hello, {user.firstName}</h6>
						<Button variant="secondary" onClick={handleSignOut}>
							Log Out
						</Button>
					</>
				)}
				{!user && (
					<>
						<Link to={ROUTER_KEYS.LOG_IN}>Log In</Link>
						<Link to={ROUTER_KEYS.SIGN_UP}>Sign Up</Link>
					</>
				)}
			</div>
		</header>
	);
};

export default Header;
