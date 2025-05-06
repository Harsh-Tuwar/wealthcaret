import { create } from 'zustand';
import * as firebaseAuth from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import * as CollectionStrings from '../constants/Firebase';
import { log } from '../utils/logger';
import { FIREBASE_DB, auth } from '../firebase';
import { AuthStore, FirestoreUser } from '@/types/types';

export const useAuthStore = create<AuthStore>((set) => ({
	isLoggedIn: false,
	initialized: false,
	user: null,
	fsUser: null,
	setUser: (user) => set({ user }),
	setLoggedIn: (status) => set({ isLoggedIn: status }),
	setFsUser: (fsUser) => set({ fsUser }),
}));

// Firebase authentication state listener
const unsub = firebaseAuth.onAuthStateChanged(auth, async (user) => {
	log.info('AUTHENTICATED USER:- ', user?.email ?? 'UNAUTHENTICATED');
	
	let fsUser: FirestoreUser | null = null;

	if (user) {
		const docRef = doc(FIREBASE_DB, CollectionStrings.FIREBASE_USERS_COLLECTION, user.uid);
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			fsUser = docSnap.data() as FirestoreUser;
			fsUser.uid = docSnap.id;
		}
	}

	useAuthStore.setState({
		user,
		isLoggedIn: !!user,
		fsUser,
		initialized: true, // ✅ Correct way to update
	});
});

export const appSignIn = async (email: string, password: string) => {
	try {
		const resp = await firebaseAuth.signInWithEmailAndPassword(auth, email, password);
		let fsUser: FirestoreUser | null = null;
		
		if (resp.user) {
			const docRef = doc(FIREBASE_DB, CollectionStrings.FIREBASE_USERS_COLLECTION, resp.user.uid);
			const docSnap = await getDoc(docRef);

			if (docSnap.exists()) {
				fsUser = docSnap.data() as FirestoreUser;
				fsUser.uid = docSnap.id;
			}
		}

		console.log(fsUser);

		useAuthStore.getState().setUser(resp.user);
		useAuthStore.getState().setLoggedIn(!!resp.user);
		useAuthStore.getState().setFsUser(fsUser);

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

		useAuthStore.getState().setUser(null);
		useAuthStore.getState().setLoggedIn(false);

		return {};
	} catch (error) {
		return {
			error
		};
	}
}

export const appSignUp = async (email: string, password: string, displayName: string) => {
	try {
		const resp = await firebaseAuth.createUserWithEmailAndPassword(auth, email, password);

		let fsUser: FirestoreUser = {
			name: displayName,
			phone: resp.user.phoneNumber,
			bio: "",
			dob: "",
			uid: "",
			createAt: new Date().toISOString(),
		};

		if (resp.user) {
			await firebaseAuth.updateProfile(resp.user, { displayName });

			fsUser.email = resp.user.email ?? 'n/a';
			fsUser.uid = resp.user.uid;

			await setDoc(doc(FIREBASE_DB, CollectionStrings.FIREBASE_USERS_COLLECTION, resp.user.uid), fsUser);
		}

		useAuthStore.getState().setUser(auth.currentUser);
		useAuthStore.getState().setLoggedIn(true);
		useAuthStore.getState().setFsUser(fsUser);

		return { user: auth.currentUser };
	} catch (error) {
		return {
			error
		};
	}
};
