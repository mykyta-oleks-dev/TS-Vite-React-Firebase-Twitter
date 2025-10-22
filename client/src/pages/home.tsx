import Link from '@/components/link';
import PageTitle from '@/components/page-title';
import PostsList from '@/components/posts';
import { Button } from '@/components/ui/button';
import { ROUTES, ROUTES_LABELS } from '@/constants/routes';
import useUser from '@/stores/authStore';

const HomePage = () => {
	const userData = useUser((s) => s.userData);

	return (
		<div>
			<PageTitle title="Latest posts">
				{userData && userData.emailVerified && (
					<Button asChild>
						<Link to={ROUTES.POSTS_CREATE}>
							{ROUTES_LABELS[ROUTES.POSTS_CREATE]}
						</Link>
					</Button>
				)}
			</PageTitle>
			<PostsList />
		</div>
	);
};

export default HomePage;
