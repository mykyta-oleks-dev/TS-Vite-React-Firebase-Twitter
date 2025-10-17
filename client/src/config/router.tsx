import { ROUTES } from '@/constants/routes';
import HomePage from '@/pages/home';
import LogInPage from '@/pages/log-in';
import SignUpPage from '@/pages/sign-up';
import { createBrowserRouter } from 'react-router';

const router = createBrowserRouter([
	{ path: ROUTES.ROOT, children: [{ index: true, element: <HomePage /> }] },
	{ path: ROUTES.LOG_IN, element: <LogInPage /> },
	{ path: ROUTES.SIGN_UP, element: <SignUpPage /> },
	{
		path: ROUTES.SIGN_UP_GOOGLE_FINISH,
		element: <p>Finish creating account</p>,
	},
]);

export default router;
