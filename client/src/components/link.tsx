import { cn } from '@/lib/utils';
import { Link as RouterLink, NavLink, type LinkProps } from 'react-router';

const Link = ({ nav, ...props }: LinkProps & { nav?: boolean }) => {
	const Component = nav ? NavLink : RouterLink;
	return (
		<Component
			{...props}
			className={cn("hover:underline underline-offset-2", props.className)}
		>
			{props.children}
		</Component>
	);
};

export default Link;
