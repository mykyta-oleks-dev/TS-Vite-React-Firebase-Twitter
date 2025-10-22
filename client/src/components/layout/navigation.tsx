import { ROUTES, ROUTES_LABELS } from '@/constants/routes';
import Link from '../link';
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from '../ui/navigation-menu';
import type { User } from '@/types/User';

const Navigation = ({ user }: { user?: User }) => {
	return (
		<NavigationMenu>
			<NavigationMenuList>
				<NavigationMenuItem>
					<NavigationMenuLink asChild>
						<Link nav to={ROUTES.ROOT}>
							{ROUTES_LABELS[ROUTES.ROOT]}
						</Link>
					</NavigationMenuLink>
				</NavigationMenuItem>

				{user && (
					<NavigationMenuItem>
						<NavigationMenuLink asChild>
							<Link nav to={ROUTES.MY_PROFILE}>
								{ROUTES_LABELS[ROUTES.MY_PROFILE]}
							</Link>
						</NavigationMenuLink>
					</NavigationMenuItem>
				)}
			</NavigationMenuList>
		</NavigationMenu>
	);
};

export default Navigation;
