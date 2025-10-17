import { Link as RouterLink, NavLink, type LinkProps } from 'react-router';

const Link = ({ nav, ...props }: LinkProps & { nav?: boolean }) => {
	const Component = nav ? NavLink : RouterLink;
	return (
		<Component
			{...props}
			className="text-primary hover:underline underline-offset-2"
		>
			{props.children}
		</Component>
	);
};

export default Link;
