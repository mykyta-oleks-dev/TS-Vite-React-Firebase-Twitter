import PageLoader from '@/components/page-loader';
import PageTitle from '@/components/page-title';
import useUser from '@/stores/authStore';
import ProfileForm from './form';
import { APP_NAME } from '@/constants/routes';

const EditProfilePage = () => {
	const userData = useUser((s) => s.userData);
	const isLoading = useUser((s) => s.isLoading);

	if (isLoading) return <PageLoader />;

	return (
		<div>
			<title>{`${APP_NAME} - Edit Your Profile`}</title>
			<PageTitle title="Editing profile data" />
			{userData?.user && <ProfileForm user={userData.user} />}
		</div>
	);
};

export default EditProfilePage;
