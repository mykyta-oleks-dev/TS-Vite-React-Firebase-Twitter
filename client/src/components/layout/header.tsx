import { BirdIcon } from 'lucide-react';
import Navigation from './navigation';
import type { User } from '@/types/User';
import { Button } from '../ui/button';
import { signOut } from 'firebase/auth';
import { auth } from '@/config/firebase';
import Link from '../link';
import { ROUTES } from '@/constants/routes';

const Header = ({ user }: { user?: User }) => {
	return (
		<header className="flex h-20 items-center gap-5 px-5 py-5 mb-5 bg-primary text-primary-foreground">
			<div>
				<BirdIcon />
			</div>
			<Navigation />
			<div className="ml-auto flex items-center gap-2">
				{user && (
					<>
						<h6>Hello, {user.firstName}</h6>
						<Button variant='secondary' onClick={() => signOut(auth)}>Log Out</Button>
					</>
				)}
				{!user && (
					<>
						<Link to={ROUTES.LOG_IN}>Log In</Link>
						<Link to={ROUTES.SIGN_UP}>Sign Up</Link>
					</>
				)}
			</div>
		</header>
	);
};

export default Header;
