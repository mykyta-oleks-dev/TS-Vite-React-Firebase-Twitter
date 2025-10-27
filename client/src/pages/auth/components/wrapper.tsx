import type { PropsWithChildren } from 'react';

const AuthPageWrapper = ({ children }: PropsWithChildren) => {
	return (
		<div className="w-full h-screen flex justify-center items-center">
			<div className="p-5 min-w-4/5 sm:min-w-lg border border-primary rounded-xl">
				{children}
			</div>
		</div>
	);
};

export default AuthPageWrapper;
