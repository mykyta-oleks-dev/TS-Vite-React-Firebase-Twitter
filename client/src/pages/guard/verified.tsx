import PageLoader from '@/components/page-loader';
import { ROUTER_KEYS } from '@/constants/routes';
import useUser from '@/stores/authStore';
import type { PropsWithChildren } from 'react';
import { Navigate } from 'react-router';
import { toast } from 'sonner';

const VerifiedGuard = ({ children }: PropsWithChildren) => {
	const { isAuthenticated, isLoading, userData } = useUser();

	if (isLoading) return <PageLoader />;

	if (!isAuthenticated || !userData?.emailVerified) {
		const message = isAuthenticated
			? 'You have to verify your email first'
			: 'You have to be authenticated';

		toast.error(message);

		return <Navigate to={ROUTER_KEYS.ROOT} />;
	}

	return children;
};

export default VerifiedGuard;
