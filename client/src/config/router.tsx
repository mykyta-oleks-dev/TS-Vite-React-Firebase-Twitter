import Layout from '@/components/layout';
import { ROUTER_KEYS } from '@/constants/routes';
import EditProfilePage from '@/pages/profiles/my/edit';
import AuthenticatedGuard from '@/pages/guard/authed';
import UnauthenticatedGuard from '@/pages/guard/unauthed-root';
import HomePage from '@/pages/home';
import LogInPage from '@/pages/auth/log-in';
import MyProfilePage from '@/pages/profiles/my';
import ResetPasswordPage from '@/pages/auth/reset-password';
import SignUpPage from '@/pages/auth/sign-up';
import FinishSignUpPage from '@/pages/auth/sign-up-finish';
import { createBrowserRouter } from 'react-router';
import CreatePostPage from '@/pages/posts/create';
import VerifiedGuard from '@/pages/guard/verified';
import OtherProfilePage from '@/pages/profiles/view-others';
import PostDetailsPage from '@/pages/posts/details';

const router = createBrowserRouter([
	{
		path: ROUTER_KEYS.ROOT,
		element: <Layout />,
		children: [
			{ index: true, element: <HomePage /> },
			{
				path: ROUTER_KEYS.PROFILE,
				children: [
					{
						index: true,
						element: (
							<AuthenticatedGuard>
								<MyProfilePage />
							</AuthenticatedGuard>
						),
					},
					{
						path: ROUTER_KEYS.EDIT,
						element: (
							<AuthenticatedGuard>
								<EditProfilePage />
							</AuthenticatedGuard>
						),
					},
					{
						path: ROUTER_KEYS.DYNAMIC_UID,
						element: <OtherProfilePage />,
					},
				],
			},
			{
				path: ROUTER_KEYS.POSTS,
				children: [
					{
						path: ROUTER_KEYS.CREATE,
						element: (
							<VerifiedGuard>
								<CreatePostPage />
							</VerifiedGuard>
						),
					},
					{
						path: ROUTER_KEYS.DYNAMIC_ID,
						element: <PostDetailsPage />,
					},
				],
			},
		],
	},
	{
		path: ROUTER_KEYS.LOG_IN,
		element: (
			<UnauthenticatedGuard>
				<LogInPage />
			</UnauthenticatedGuard>
		),
	},
	{
		path: ROUTER_KEYS.RESET_PASSWORD,
		element: (
			<UnauthenticatedGuard>
				<ResetPasswordPage />
			</UnauthenticatedGuard>
		),
	},
	{
		path: ROUTER_KEYS.SIGN_UP,
		children: [
			{
				index: true,
				element: (
					<UnauthenticatedGuard>
						<SignUpPage />
					</UnauthenticatedGuard>
				),
			},
			{
				path: ROUTER_KEYS.FINISH,
				element: <FinishSignUpPage />,
			},
		],
	},
]);

export default router;
