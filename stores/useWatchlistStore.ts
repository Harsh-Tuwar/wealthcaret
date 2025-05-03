import { create } from 'zustand';
import { FIREBASE_DB } from '@/firebase';
import { log } from '@/utils/logger';
import { addDoc, collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { FIREBASE_USERS_COLLECTION, FIREBASE_WATCHLIST_COLLECTION } from '../constants/Firebase';

interface WatchlistItem {
	symbol: string;
	createdAt: string;
	id: string;
	shortName: string;
	longName: string;
}

interface WatchlistStore {
	items: WatchlistItem[];
	lastFetched: Date | null;
	forceFetch: boolean;
	setItems: (items: WatchlistItem[]) => void;
	addItem: (item: WatchlistItem) => void;
	removeItem: (symbol: string) => void;
	setForceFetch: (force: boolean) => void;
	setLastFetched: (date: Date) => void;
}

export const useWatchlistStore = create<WatchlistStore>((set) => ({
	items: [],
	lastFetched: null,
	forceFetch: false,
	setItems: (items) => set({ items }),
	addItem: (item) => set((state) => ({ items: [...state.items, item] })),
	removeItem: (symbol) => set((state) => ({
		items: state.items.filter(item => item.symbol !== symbol),
	})),
	setForceFetch: (force) => set({ forceFetch: force }),
	setLastFetched: (date) => set({ lastFetched: date }),
}));

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
			longName,
		});

		const newItem = {
			symbol,
			createdAt: itemCreationDate.toString(),
			id: newDocData.id,
			shortName,
			longName,
		};

		useWatchlistStore.getState().addItem(newItem);

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

		const watchlistStore = useWatchlistStore.getState();
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

		useWatchlistStore.getState().removeItem(symbol);

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

		let lastFetched = useWatchlistStore.getState().lastFetched;
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

		useWatchlistStore.getState().setItems(watchlistedItems);
		useWatchlistStore.getState().setLastFetched(new Date());

		log.debug(`Found ${count} watchlisted items for user: ${userId}`);
	} catch (error) {
		log.debug(`Error getting watchlisted items for user: ${userId}`);
		log.error(error);
		throw error;
	}
}
