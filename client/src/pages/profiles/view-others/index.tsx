import { getOneUser } from '@/api/users';
import PageLoader from '@/components/page-loader';
import PageTitle from '@/components/page-title';
import { API_ENDPOINTS } from '@/constants/api';
import { ROUTER_KEYS } from '@/constants/routes';
import { parseFetchUser } from '@/types/User';
import { useQuery } from '@tanstack/react-query';
import { Navigate, useParams } from 'react-router';
import ProfileData from '../components/data';

const ProfilePage = () => {
	const { uid } = useParams() as { uid: string };
	const { data, isPending } = useQuery({
		queryKey: [API_ENDPOINTS.USERS, uid],
		queryFn: async () => {
			const { data } = await getOneUser(uid);

			const { user: userData, isVerified } = data;

			return { user: parseFetchUser(userData), isVerified };
		},
	});

	if (isPending) return <PageLoader />;

	if (!data) return <Navigate to={ROUTER_KEYS.LOG_IN} />;

	const { user, isVerified: emailVerified } = data;

	return (
		<div>
			<PageTitle title="Account details" />

			<ProfileData user={user} emailVerified={emailVerified} />
		</div>
	);
};

export default ProfilePage;
