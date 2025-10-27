import Link from '@/components/link';
import PageTitle from '@/components/page-title';
import PostsList from '@/components/posts/list';
import { Button } from '@/components/ui/button';
import { APP_NAME, ROUTES, ROUTES_LABELS } from '@/constants/routes';
import useUser from '@/stores/authStore';

const HomePage = () => {
	const userData = useUser((s) => s.userData);

	return (
		<div>
			<title>{`${APP_NAME} - Feed`}</title>
			<PageTitle title="Latest posts">
				{userData && userData.emailVerified && (
					<Button asChild>
						<Link to={ROUTES.POST_CREATE}>
							{ROUTES_LABELS[ROUTES.POST_CREATE]}
						</Link>
					</Button>
				)}
			</PageTitle>
			<PostsList sortType="hot" />
		</div>
	);
};

export default HomePage;
