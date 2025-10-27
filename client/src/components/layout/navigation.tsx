import { ROUTER_KEYS, ROUTES, ROUTES_LABELS } from '@/constants/routes';
import { handleSignOut } from '@/handlers/users';
import type { User } from '@/types/User';
import type { NavigationMenuProps } from '@radix-ui/react-navigation-menu';
import Link from '../link';
import NavLink from '../nav-link';
import { Button } from '../ui/button';
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from '../ui/navigation-menu';
import { cn } from '@/lib/utils';

const Navigation = ({
	user,
	orientation = 'horizontal',
}: {
	user?: User;
	orientation?: NavigationMenuProps['orientation'];
}) => {
	return (
		<>
			<NavigationMenu
				orientation={orientation}
				className={orientation === 'vertical' ? 'navmenu-vertical' : ''}
			>
				<NavigationMenuList>
					<NavigationMenuItem>
						<NavigationMenuLink asChild>
							<NavLink to={ROUTES.ROOT}>
								{ROUTES_LABELS[ROUTES.ROOT]}
							</NavLink>
						</NavigationMenuLink>
					</NavigationMenuItem>

					{user && (
						<NavigationMenuItem>
							<NavigationMenuLink asChild>
								<NavLink to={ROUTES.MY_PROFILE} end>
									{ROUTES_LABELS[ROUTES.MY_PROFILE]}
								</NavLink>
							</NavigationMenuLink>
						</NavigationMenuItem>
					)}
				</NavigationMenuList>
			</NavigationMenu>

			<div
				className={cn(
					'sm:ml-auto sm:flex grid items-center gap-2 justify-stretch text-center sm:p-0 px-2',
					user ? 'grid-cols-2' : 'grid-cols-1',
					orientation === 'vertical' ? 'sm:w-full' : ''
				)}
			>
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
		</>
	);
};

export default Navigation;
