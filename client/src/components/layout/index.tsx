import { Outlet } from 'react-router';
import Header from './header';
import useAuth from '@/hooks/useAuth';
import PageLoader from '../page-loader';

const Layout = () => {
	const { userData, authLoading } = useAuth();
	const user = userData?.user;

	if (authLoading) return <PageLoader />;

	return (
		<div className="min-h-screen flex flex-col">
			<Header user={user} />
			<main className="flex-1 px-5 pb-5">
				<Outlet />
			</main>
		</div>
	);
};

export default Layout;
