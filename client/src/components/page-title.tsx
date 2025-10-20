import { cn } from '@/lib/utils';
import type { ClassValue } from 'clsx';
import type { PropsWithChildren } from 'react';

const PageTitle = ({
	title,
	sub,
	children,
	className,
}: PropsWithChildren<{ title: string; sub?: string; className?: ClassValue }>) => {
	return (
		<div className={cn('flex justify-between mb-5', className)}>
			<div>
				<h2 className="text-2xl font-semibold">{title}</h2>
				{sub && <p className='text-sm font-semibold text-gray-500'>{sub}</p>}
			</div>
			{children}
		</div>
	);
};

export default PageTitle;
