import PageLoader from '@/components/page-loader';
import PageTitle from '@/components/page-title';
import { ROUTER_KEYS } from '@/constants/routes';
import useUser from '@/stores/authStore';
import { Navigate } from 'react-router';
import ProfileData from './data';

const ProfilePage = () => {
	const userData = useUser((s) => s.userData);
	const isLoading = useUser((s) => s.isLoading);

	if (isLoading) return <PageLoader />;

	if (!userData) return <Navigate to={ROUTER_KEYS.LOG_IN} />;

	const { user, emailVerified } = userData;

	return (
		<div>
			<PageTitle title="Your profile page" />
			<ProfileData user={user} emailVerified={emailVerified} />
		</div>
	);
};

export default ProfilePage;
