import { Store, registerInDevtools } from 'pullstate';
import * as firebaseAuth from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import * as CollectionStrings from '../constants/Firebase';
import { log } from '../utils/logger';
import { FIREBASE_DB, auth } from '../firebase';

type FirestoreUser = {
	name: string,
	createAt: Date,
	uid: string
}
interface AuthStore {
	isLoggedIn: boolean;
	initialized: boolean;
	user: firebaseAuth.User | null;
	fsUser: FirestoreUser | null;
}

export const AuthStore = new Store<AuthStore>({
	isLoggedIn: false,
	initialized: false,
	user: null,
	fsUser: null
});

const unsub = firebaseAuth.onAuthStateChanged(auth, (user) => {
	log.info("AUTHENTICATED USER:- ", user?.email ?? 'UNAUTHENTICATED');
	AuthStore.update((store) => {
		store.user = user;
		store.isLoggedIn = user ? true : false;
		store.initialized = true;
	});
});

export const appSignIn = async (email: string, password: string) => {
	try {
		const resp = await firebaseAuth.signInWithEmailAndPassword(auth, email, password);
		let fsUser: FirestoreUser;
		
		if (resp.user) {
			const docRef = doc(FIREBASE_DB, CollectionStrings.FIREBASE_USERS_COLLECTION, resp.user.uid);
			const docSnap = await getDoc(docRef);

			if (docSnap.exists()) {
				fsUser = docSnap.data() as FirestoreUser;
				fsUser.uid = docSnap.id;
			}
		}

		AuthStore.update((store) => {
			store.user = resp.user;
			store.isLoggedIn = resp.user ? true : false;
			store.fsUser = fsUser;
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
			await setDoc(doc(FIREBASE_DB, CollectionStrings.FIREBASE_USERS_COLLECTION, resp.user.uid), {
				name: displayName,
				createAt: new Date()
			});
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
