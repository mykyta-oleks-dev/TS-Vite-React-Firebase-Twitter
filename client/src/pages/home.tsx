import useAuthState from '@/stores/authStore';

const HomePage = () => {
	const { userData: authState } = useAuthState();
	const user = authState?.user;

	return (
		<div>
			<h1>
				Hello {user ? `${user.firstName} ${user.lastName}` : 'world'}
			</h1>
		</div>
	);
};

export default HomePage;
