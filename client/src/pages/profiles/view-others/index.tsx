import { getOneUser } from '@/api/users';
import PageLoader from '@/components/page-loader';
import PageTitle from '@/components/page-title';
import { API_ENDPOINTS } from '@/constants/api';
import { ROUTES } from '@/constants/routes';
import { parseFetchUser } from '@/types/User';
import { useQuery } from '@tanstack/react-query';
import { Navigate, useParams } from 'react-router';
import ProfileData from '../components/data';
import { handleError } from '@/lib/utils';

const ProfilePage = () => {
	const { uid } = useParams() as { uid: string };
	const { data, error, isPending } = useQuery({
		queryKey: [API_ENDPOINTS.USERS, uid],
		queryFn: async () => {
			const { data } = await getOneUser(uid);

			const { user: userData, isVerified } = data;

			return { user: parseFetchUser(userData), isVerified };
		},
	});

	if (isPending) return <PageLoader />;

	if (error) handleError(error, true);

	if (!data) return <Navigate to={ROUTES.ROOT} />;

	const { user, isVerified: emailVerified } = data;

	return (
		<div>
			<PageTitle title="Account details" />

			<ProfileData user={user} emailVerified={emailVerified} />
		</div>
	);
};

export default ProfilePage;
