import { cn } from '@/lib/utils';
import { NavLink as RouterLink, type NavLinkProps } from 'react-router';

const NavLink = ({ ...props }: NavLinkProps) => {
	return (
		<RouterLink
			{...props}
			className={cn(
				'underline-offset-2',
				props.className
			)}
		>
			{props.children}
		</RouterLink>
	);
};

export default NavLink;
