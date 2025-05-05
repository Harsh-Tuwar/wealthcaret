import { create } from 'zustand';
import * as firebaseAuth from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import * as CollectionStrings from '../constants/Firebase';
import { log } from '../utils/logger';
import { FIREBASE_DB, auth } from '../firebase';
import { createNewPortfolio } from './usePortofolioStore';
import { PortfolioType } from '@/constants/types';

type FirestoreUser = {
	name: string,
	createAt: Date,
	uid: string
};

interface AuthStore {
	isLoggedIn: boolean;
	initialized: boolean;
	user: firebaseAuth.User | null;
	fsUser: FirestoreUser | null;
	setUser: (user: firebaseAuth.User | null) => void;
	setLoggedIn: (status: boolean) => void;
	setFsUser: (fsUser: FirestoreUser | null) => void;
}

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
const unsub = firebaseAuth.onAuthStateChanged(auth, (user) => {
	log.info('AUTHENTICATED USER:- ', user?.email ?? 'UNAUTHENTICATED');
	useAuthStore.setState({
		user,
		isLoggedIn: !!user,
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

		if (resp.user) {
			await firebaseAuth.updateProfile(resp.user, { displayName });
			await setDoc(doc(FIREBASE_DB, CollectionStrings.FIREBASE_USERS_COLLECTION, resp.user.uid), {
				name: displayName,
				createAt: new Date()
			});
			await createNewPortfolio(`${displayName}'s Portfolio`, PortfolioType.MIXED, resp.user.uid, true);
		}

		useAuthStore.getState().setUser(auth.currentUser);
		useAuthStore.getState().setLoggedIn(true);

		return { user: auth.currentUser };
	} catch (error) {
		return {
			error
		};
	}
};
