import { cn } from '@/lib/utils';
import { Link as RouterLink, type LinkProps } from 'react-router';

const Link = (props: LinkProps) => {
	return (
		<RouterLink
			{...props}
			className={cn(
				'hover:underline underline-offset-2',
				props.className
			)}
		>
			{props.children}
		</RouterLink>
	);
};

export default Link;
