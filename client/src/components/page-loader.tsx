import { Spinner } from './ui/spinner';

const PageLoader = () => {
	return (
		<div className="absolute inset-0 backdrop-blur-xs flex items-center justify-center z-10">
			<Spinner className="size-10" />
		</div>
	);
};

export default PageLoader;
