import PageLoader from '@/components/page-loader';
import { ROUTER_KEYS } from '@/constants/routes';
import useUser from '@/stores/authStore';
import type { PropsWithChildren } from 'react';
import { Navigate } from 'react-router';

const AuthenticatedGuard = ({ children }: PropsWithChildren) => {
	const { isAuthenticated, isLoading } = useUser();

	if (isLoading) return <PageLoader />;

	if (isAuthenticated) return children;

	return <Navigate to={ROUTER_KEYS.ROOT} />;
};

export default AuthenticatedGuard;
