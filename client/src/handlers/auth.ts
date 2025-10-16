import { auth } from '@/config/firebase';
import { API } from '@/constants/env';
import type { signInData, signUpData } from '@/schemas/auth';
import {
	signInWithCustomToken,
	signInWithEmailAndPassword,
} from 'firebase/auth';

export const handleSignUp = async (values: signUpData) => {
	console.log({ values });

	try {
		const res = await fetch(API.ROUTE, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(values),
		});

		const data = (await res.json()) as { token: string };

		if (!res.ok) throw data;

		const userCredential = await signInWithCustomToken(auth, data.token);
		console.log(await userCredential.user.getIdToken());
	} catch (err) {
		console.error(err);
	}
};

export const handleSignIn = async (values: signInData) => {
	try {
		const results = await signInWithEmailAndPassword(
			auth,
			values.email,
			values.password
		);
		const user = results.user;
		console.log(await user.getIdToken());
	} catch (err) {
		console.error(err);
	}
};
