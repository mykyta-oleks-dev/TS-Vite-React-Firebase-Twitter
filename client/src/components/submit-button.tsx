import type { ComponentProps } from 'react';
import { Button } from './ui/button';
import { Spinner } from './ui/spinner';

const SubmitButton = ({
	isSubmitting,
	children,
	...props
}: ComponentProps<typeof Button> & { isSubmitting: boolean }) => {
	return (
		<Button {...props} type="submit" disabled={isSubmitting}>
			{children} {isSubmitting && <Spinner />}
		</Button>
	);
};

export default SubmitButton;
