import PageLoader from '@/components/page-loader';
import PageTitle from '@/components/page-title';
import { ROUTER_KEYS, ROUTES } from '@/constants/routes';
import useUser from '@/stores/authStore';
import { Navigate } from 'react-router';
import ProfileData from '../components/data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DangerousZone from './dangerous-zone';
import { Button } from '@/components/ui/button';
import Link from '@/components/link';

const MyProfilePage = () => {
	const userData = useUser((s) => s.userData);
	const isLoading = useUser((s) => s.isLoading);

	if (isLoading) return <PageLoader />;

	if (!userData) return <Navigate to={ROUTER_KEYS.LOG_IN} />;

	const { user, emailVerified } = userData;

	return (
		<div>
			<PageTitle title="Account details">
				<Button asChild>
					<Link to={ROUTES.PROFILE_EDIT}>Edit</Link>
				</Button>
			</PageTitle>
			<Tabs defaultValue="data">
				<TabsList className="mb-3">
					<TabsTrigger value="data">Profile data</TabsTrigger>
					<TabsTrigger value="dangerous">Dangerous zone</TabsTrigger>
				</TabsList>
				<TabsContent value="data">
					<ProfileData user={user} emailVerified={emailVerified} />
				</TabsContent>
				<TabsContent value="dangerous">
					<DangerousZone user={user} emailVerified={emailVerified} />
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default MyProfilePage;
