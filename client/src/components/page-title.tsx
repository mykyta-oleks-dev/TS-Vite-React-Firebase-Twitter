import { cn } from '@/lib/utils';
import type { ClassValue } from 'clsx';
import type { PropsWithChildren } from 'react';

const PageTitle = ({
	title,
	children,
	className,
}: PropsWithChildren<{ title: string; className?: ClassValue }>) => {
	return (
		<div className={cn('flex justify-between mb-5', className)}>
			<h2 className="text-2xl font-semibold">{title}</h2>
			{children}
		</div>
	);
};

export default PageTitle;
