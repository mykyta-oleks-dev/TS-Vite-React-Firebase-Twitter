import PageLoader from '@/components/page-loader';
import PageTitle from '@/components/page-title';
import { ROUTER_KEYS } from '@/constants/routes';
import useUser from '@/stores/authStore';
import { Navigate } from 'react-router';
import ProfileData from './data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PasswordChange from './password-change';

const ProfilePage = () => {
	const userData = useUser((s) => s.userData);
	const isLoading = useUser((s) => s.isLoading);

	if (isLoading) return <PageLoader />;

	if (!userData) return <Navigate to={ROUTER_KEYS.LOG_IN} />;

	const { user, emailVerified } = userData;

	return (
		<div>
			<PageTitle title="Account details" />
			<Tabs defaultValue="data">
				<TabsList className='mb-3'>
					<TabsTrigger value="data">Profile data</TabsTrigger>
					<TabsTrigger value="security">
						Security information
					</TabsTrigger>
				</TabsList>
				<TabsContent value="data">
					<ProfileData user={user} emailVerified={emailVerified} />
				</TabsContent>
				<TabsContent value="security">
					<PasswordChange user={user} />
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default ProfilePage;
