import { Store, registerInDevtools } from 'pullstate';
import * as firebaseAuth from 'firebase/auth';
import { log } from '../utils/logger';

import { auth } from '../firebase';

interface AuthStore {
	isLoggedIn: boolean;
	initialized: boolean;
	user: firebaseAuth.User | null;
}

export const AuthStore = new Store<AuthStore>({
	isLoggedIn: false,
	initialized: false,
	user: null
});

const unsub = firebaseAuth.onAuthStateChanged(auth, (user) => {
	log.info('On Auth State Change Triggered');
	AuthStore.update((store) => {
		store.user = user;
		store.isLoggedIn = user ? true : false;
		store.initialized = true;
	});
});

export const appSignIn = async (email: string, password: string) => {
	try {
		const resp = await firebaseAuth.signInWithEmailAndPassword(auth, email, password);

		AuthStore.update((store) => {
			store.user = resp.user;
			store.isLoggedIn = resp.user ? true : false
		});

		return {
			user: auth.currentUser
		};
	} catch (err) {
		return {
			error: err
		};
	}
}

export const appSignOut = async () => {
	try {
		await firebaseAuth.signOut(auth);

		AuthStore.update((store) => {
			store.user = null;
			store.isLoggedIn = false;
		});
	} catch (error) {
		return {
			error
		};
	}
}

export const appSignUp = async (email: string, password: string, displayName: string) => {
	try {
		const resp = await firebaseAuth.createUserWithEmailAndPassword(auth, email, password);

		if (resp.user) {
			await firebaseAuth.updateProfile(resp.user, { displayName });
		}

		AuthStore.update((store) => {
			store.user = auth.currentUser;
			store.isLoggedIn = true;
		});

		return { user: auth.currentUser };
	} catch (error) {
		return {
			error
		};
	}
}

registerInDevtools({ AuthStore });
