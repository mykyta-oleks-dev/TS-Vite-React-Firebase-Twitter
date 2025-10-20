
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from '../ui/navigation-menu';
import Link from '../link';
import { ROUTES } from '@/constants/routes';

const Navigation = () => {
	return ( 
			<NavigationMenu>
				<NavigationMenuList>
					<NavigationMenuItem>
						<NavigationMenuLink asChild>
							<Link nav to={ROUTES.ROOT}>
								Home
							</Link>
						</NavigationMenuLink>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu> );
}
 
export default Navigation;
