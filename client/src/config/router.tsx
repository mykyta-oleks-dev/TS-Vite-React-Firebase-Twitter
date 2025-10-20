import Layout from '@/components/layout';
import { ROUTES } from '@/constants/routes';
import AuthedGuard from '@/pages/guard/authed';
import HomePage from '@/pages/home';
import LogInPage from '@/pages/log-in';
import SignUpPage from '@/pages/sign-up';
import FinishSignUpPage from '@/pages/sign-up-finish';
import { createBrowserRouter } from 'react-router';

const router = createBrowserRouter([
	{
		path: ROUTES.ROOT,
		element: <Layout />,
		children: [{ index: true, element: <HomePage /> }],
	},
	{
		path: ROUTES.LOG_IN,
		element: (
			<AuthedGuard>
				<LogInPage />
			</AuthedGuard>
		),
	},
	{
		path: ROUTES.SIGN_UP,
		element: (
			<AuthedGuard>
				<SignUpPage />
			</AuthedGuard>
		),
	},
	{
		path: ROUTES.SIGN_UP_FINISH,
		element: <FinishSignUpPage />,
	},
]);

export default router;
