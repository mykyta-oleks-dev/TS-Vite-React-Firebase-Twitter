import { ROUTES, ROUTES_LABELS } from '@/constants/routes';
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from '../ui/navigation-menu';
import type { User } from '@/types/User';
import NavLink from '../nav-link';

const Navigation = ({ user }: { user?: User }) => {
	return (
		<NavigationMenu>
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
	);
};

export default Navigation;
