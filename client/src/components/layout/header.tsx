import { ROUTES } from '@/constants/routes';
import { useMediaQuery } from '@/hooks/use-media-query';
import type { User } from '@/types/User';
import { BirdIcon } from 'lucide-react';
import Link from '../link';
import { ModeToggle } from '../theme-toggle';
import DrawerNavigation from './drawer-navigation';
import Navigation from './navigation';

const Header = ({ user }: { user?: User }) => {
	const isMobile = useMediaQuery("(max-width: 640px)")
	
	return (
		<header className="flex h-15 items-center gap-5 px-5 py-5 mb-5 bg-primary text-primary-foreground">
			<Link to={ROUTES.ROOT}>
				<BirdIcon />
			</Link>
			{!isMobile && <Navigation user={user} />}
			<ModeToggle />
			{isMobile && <DrawerNavigation user={user} />}
		</header>
	);
};

export default Header;
