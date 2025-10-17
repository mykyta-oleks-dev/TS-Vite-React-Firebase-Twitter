import { cn } from '@/lib/utils';
import type { ImgHTMLAttributes } from 'react';

const AvatarBig = ({
	src,
	className
}: {
	src: ImgHTMLAttributes<HTMLImageElement>['src'];
	className?: string
}) => {
	return (
		<div className={cn("h-20 w-20 overflow-hidden rounded-full shrink-0", className)}>
			<img src={src} alt="User's avatar" className="object-cover h-full w-full" />
		</div>
	);
};

export default AvatarBig;
