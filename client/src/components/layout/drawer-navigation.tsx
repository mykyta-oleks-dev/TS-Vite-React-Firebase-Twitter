import { MenuIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from '../ui/drawer';
import Navigation from './navigation';
import type { User } from '@/types/User';

const DrawerNavigation = ({ user }: { user?: User }) => {
	return (
		<Drawer direction="right">
			<DrawerTrigger asChild>
				<Button
					size="icon"
					variant="outline"
					className="bg-background hover:bg-background text-foreground"
				>
					<MenuIcon />
				</Button>
			</DrawerTrigger>
			<DrawerContent className='max-w-sm'>
				<Navigation user={user} orientation="vertical" />
			</DrawerContent>
		</Drawer>
	);
};

export default DrawerNavigation;
