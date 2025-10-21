import PageLoader from '@/components/page-loader';
import { ROUTES } from '@/constants/routes';
import useAuth from '@/hooks/useAuth';
import type { PropsWithChildren } from 'react';
import { Navigate } from 'react-router';

const UnauthenticatedGuard = ({ children }: PropsWithChildren) => {
	const { isAuthenticated, authLoading } = useAuth();

	if (authLoading) return <PageLoader />;

	if (!isAuthenticated) return children;

	return <Navigate to={ROUTES.ROOT} />;
};

export default UnauthenticatedGuard;
