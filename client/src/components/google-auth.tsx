import { handleGoogleAuth } from '@/handlers/auth';
import { Button } from './ui/button/button';
import { FaGoogle } from 'react-icons/fa';

const GoogleAuthButton = ({ isLogin }: { isLogin?: boolean }) => {
	return (
		<Button onClick={handleGoogleAuth} type="button" variant="outline">
			<FaGoogle /> {isLogin ? 'Log In' : 'Sign Up'} with Google
		</Button>
	);
};

export default GoogleAuthButton;
