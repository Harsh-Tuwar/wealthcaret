import { Store, registerInDevtools } from 'pullstate';

import { FIREBASE_DB } from '@/firebase';

import { log } from '@/utils/logger';
import { addDoc, collection, deleteDoc, doc, getDocs } from 'firebase/firestore';

import { FIREBASE_USERS_COLLECTION, FIREBASE_WATCHLIST_COLLECTION } from '../constants/Firebase';

interface WatchlistItem {
	symbol: string;
	createdAt: string;
	id: string;
	shortName: string
	longName: string
}

interface WatchlistStore {
	items: WatchlistItem[];
	lastFetched: Date | null;
	forceFetch: boolean;
}

export const WatchlistStore = new Store<WatchlistStore>({
	items: [],
	lastFetched: null,
	forceFetch: false
});

export const addToWatchlist = async (symbol: string, shortName: string, longName: string, userId: string) => {
	try {
		log.debug(`Adding ${symbol} to the watchlist for user: ${userId}`);

		const itemCreationDate = new Date();

		const newDocData = await addDoc(collection(
			FIREBASE_DB,
			FIREBASE_USERS_COLLECTION,
			userId,
			FIREBASE_WATCHLIST_COLLECTION
		), {
			symbol,
			createdAt: itemCreationDate,
			shortName,
			longName
		});

		WatchlistStore.update((store) => {
			store.forceFetch = true;
			store.items.push({
				symbol,
				createdAt: itemCreationDate.toString(),
				id: newDocData.id,
				shortName,
				longName
			});
		});

		log.debug(`${symbol} added to the watchlist for user: ${userId}`);
	} catch (error) {
		log.debug(`Error adding ${symbol} to the watchlist for user: ${userId}`);
		log.error(error);
		throw error;
	}
}

export const removeFromWatchlist = async (symbol: string, userId: string) => {
	try {
		log.debug(`Removing ${symbol} from the watchlist for user: ${userId}`);

		const watchlistStore = WatchlistStore.getRawState();
		const itemToRemoveIndex = watchlistStore.items.findIndex((item) => item.symbol === symbol);

		if (itemToRemoveIndex === -1) {
			log.debug(`Trying to remove ${symbol}, but it doesn't exist in the memory! Skipping it now!`);
			return;
		}

		const docRef = doc(
			FIREBASE_DB,
			FIREBASE_USERS_COLLECTION,
			userId,
			FIREBASE_WATCHLIST_COLLECTION,
			watchlistStore.items[itemToRemoveIndex].id
		);

		await deleteDoc(docRef);

		WatchlistStore.update((store) => {
			store.forceFetch = true;
			store.items.splice(itemToRemoveIndex, 1);
		});

		log.debug(`${symbol} deleted from the watchlist for user: ${userId}`);
	} catch (error) {
		log.debug(`Error deleting ${symbol} to the watchlist for user: ${userId}`);
		log.error(error);
		throw error;
	}
}

export const getAllWatchlistedItems = async (userId: string) => {
	try {
		log.debug(`Fetching watchlists for user: ${userId}`);

		let lastFetched = WatchlistStore.getRawState().lastFetched;
		let fiveMinutesAgo = new Date(new Date().getTime() - 5 * 60 * 1000);

		if (lastFetched === null) {
			lastFetched = new Date();
		}
		
		if (lastFetched <= fiveMinutesAgo) {
			log.debug(`Skipping fetching watchlists!`);
			return;
		}

		const collectionRef = collection(
			FIREBASE_DB,
			FIREBASE_USERS_COLLECTION,
			userId,
			FIREBASE_WATCHLIST_COLLECTION
		);

		const querySnapshot = await getDocs(collectionRef);

		const watchlistedItems: WatchlistItem[] = [];
		let count = 0;

		querySnapshot.forEach((doc) => {
			let wItem = { id: doc.id };
			wItem = { ...wItem, ...doc.data() };
			watchlistedItems.push(wItem as WatchlistItem);
			count++;
		});

		WatchlistStore.update((store) => {
			store.items = watchlistedItems;
			store.lastFetched = new Date();
		});

		log.debug(`Found ${count} watchlisted items for user: ${userId}`);
	} catch (error) {
		log.debug(`Error getting watchlisted items for user: ${userId}`);
		log.error(error);
		throw error;
	}
}

registerInDevtools({ WatchlistStore });
