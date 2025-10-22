import AvatarBig from '@/components/avatar-big';
import PostsList from '@/components/posts';
import { Button } from '@/components/ui/button';
import { handleResendVerification } from '@/handlers/users';
import type { User } from '@/types/User';
import { Check } from 'lucide-react';

const ProfileData = ({
	user,
	emailVerified,
}: {
	user: User;
	emailVerified: boolean;
}) => {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
			<div className="flex gap-5">
				<AvatarBig src={user.avatar} className="size-30" />
				<div className="flex flex-col gap-3">
					<span>
						<h3 className="flex items-center gap-2">
							<span className="text-2xl font-semibold">
								{user.firstName} {user.lastName}
							</span>
							{emailVerified ? (
								<Check className="text-primary" />
							) : (
								<Button
									className="ml-3"
									onClick={handleResendVerification}
								>
									Send verification link
								</Button>
							)}
						</h3>
						<p>{user.email}</p>
					</span>
					<h4 className="text-lg">
						<span className="font-semibold">Birthday:</span>{' '}
						{user.birthday.toLocaleDateString('en-US', {
							year: 'numeric',
							day: '2-digit',
							month: 'long',
						})}
					</h4>
					<h4 className="text-lg">
						<span className="font-semibold">Location:</span>{' '}
						{user.location ?? 'Not set'}
					</h4>
				</div>
			</div>
			<div className="flex-1">
				<h4 className="text-lg font-semibold">About:</h4>
				<p>{user.about ?? 'Nothing to tell'}</p>
			</div>
			<PostsList className='col-span-full' userId={user.id} />
		</div>
	);
};

export default ProfileData;
