import Layout from '@/components/layout';
import { ROUTER_KEYS } from '@/constants/routes';
import EditProfilePage from '@/pages/users/edit-profile';
import AuthenticatedGuard from '@/pages/guard/authed';
import UnauthenticatedGuard from '@/pages/guard/unauthed-root';
import HomePage from '@/pages/home';
import LogInPage from '@/pages/auth/log-in';
import ProfilePage from '@/pages/users/profile';
import ResetPasswordPage from '@/pages/auth/reset-password';
import SignUpPage from '@/pages/auth/sign-up';
import FinishSignUpPage from '@/pages/auth/sign-up-finish';
import { createBrowserRouter, Outlet } from 'react-router';

const router = createBrowserRouter([
	{
		path: ROUTER_KEYS.ROOT,
		element: <Layout />,
		children: [
			{ index: true, element: <HomePage /> },
			{
				path: ROUTER_KEYS.PROFILE,
				element: (
					<AuthenticatedGuard>
						<Outlet />
					</AuthenticatedGuard>
				),
				children: [
					{ index: true, element: <ProfilePage /> },
					{ path: ROUTER_KEYS.EDIT, element: <EditProfilePage /> },
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
