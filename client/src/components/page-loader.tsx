import { Spinner } from './ui/spinner';

const PageLoader = () => {
	return (
		<div className="h-screen w-screen bg-white flex items-center justify-center">
			<Spinner className="size-10" />
		</div>
	);
};

export default PageLoader;
