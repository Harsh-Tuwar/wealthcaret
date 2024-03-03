import { Store, registerInDevtools } from 'pullstate';
import * as CollectionStrings from '../constants/Firebase';
import { setDoc, doc, updateDoc, getDoc, increment, addDoc, collection, onSnapshot, getDocs, query, where } from 'firebase/firestore';

import { FIREBASE_DB } from '../firebase';

import { log } from '@/utils/logger';

interface PortfolioStore {
	portfolios: Portfolio[];
	lastFetched: Date | null;
	forceFetch: boolean;
}

export const PortfolioStore = new Store<PortfolioStore>({
	portfolios: [],
	lastFetched: null,
	forceFetch: false,
});

export const createNewPortfolio = async (portfolioName: string, type: PortfolioType, userId: string) => {
	try {
		log.debug(`Creating new Portfolio for user: ${userId}`);

		await addDoc(collection(FIREBASE_DB, CollectionStrings.FIRESTORE_PORTFOLIO_COLLECTION), {
			title: portfolioName,
			type,
			userId,
			createdAt: new Date()
		});

		PortfolioStore.update((store) => {
			store.forceFetch = true
		});

		log.debug(`Portfolio created successfully for user: ${userId}`)
	} catch (error) {
		log.debug(`Error creating new portfolio for user: ${userId}`);
		log.error(error);
		throw error;
	}
}

export const getPortfolios = async (userId: string) => {
	try {
		log.debug(`Fetching portfolios for user: ${userId}`);

		let lastFetched = PortfolioStore.getRawState().lastFetched;
		let fiveMinutesAgo = new Date(new Date().getTime() - 5 * 60 * 1000);

		if (lastFetched === null) {
			lastFetched = new Date();
		}
		
		if (lastFetched <= fiveMinutesAgo) {
			log.debug(`Skipping fetching portfolios!`);
			return;
		}

		const q = query(collection(FIREBASE_DB, CollectionStrings.FIRESTORE_PORTFOLIO_COLLECTION), where("userId", "==", userId));
		const querySnapshot = await getDocs(q);

		const pfls: Portfolio[] = [];
		let count = 0;

		querySnapshot.forEach((doc) => {
			let pItem = { id: doc.id };
			pItem = { ...pItem, ...doc.data() };
			pfls.push(pItem as Portfolio);
			count++;
		});

		PortfolioStore.update((store) => {
			store.portfolios = pfls;
			store.lastFetched = new Date();
		});

		log.debug(`Found ${count} portfolios for user: ${userId}`);
	} catch (error) {
		log.debug(`Error getting portfolios for user: ${userId}`);
		log.error(error);
		throw error;
	}
}

registerInDevtools({ PortfolioStore });
