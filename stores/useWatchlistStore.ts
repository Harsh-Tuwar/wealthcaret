// watchlistStore.ts

import { create } from 'zustand';
import { FIREBASE_DB } from '@/firebase';
import { log } from '@/utils/logger';
import { addDoc, collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { FIREBASE_USERS_COLLECTION, FIREBASE_WATCHLIST_COLLECTION } from '@/constants/Firebase';

export interface WatchlistItem {
  symbol: string;
  createdAt: string;
  id: string;
  shortName: string;
  longName: string;
}

interface WatchlistState {
  items: WatchlistItem[];
  lastFetched: Date | null;
  forceFetch: boolean;

  addToWatchlist: (symbol: string, shortName: string, longName: string, userId: string) => Promise<void>;
  removeFromWatchlist: (symbol: string, userId: string) => Promise<void>;
  getAllWatchlistedItems: (userId: string) => Promise<void>;
}

export const useWatchlistStore = create<WatchlistState>((set, get) => ({
  items: [],
  lastFetched: null,
  forceFetch: false,

  addToWatchlist: async (symbol, shortName, longName, userId) => {
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

      set((state) => ({
        items: [
          ...state.items,
          {
            symbol,
            createdAt: itemCreationDate.toString(),
            id: newDocData.id,
            shortName,
            longName,
          },
        ],
        forceFetch: true,
      }));

      log.debug(`${symbol} added to the watchlist for user: ${userId}`);
    } catch (error) {
      log.debug(`Error adding ${symbol} to the watchlist for user: ${userId}`);
      log.error(error);
      throw error;
    }
  },

  removeFromWatchlist: async (symbol, userId) => {
    try {
      log.debug(`Removing ${symbol} from the watchlist for user: ${userId}`);

      const { items } = get();
      const itemToRemove = items.find((item) => item.symbol === symbol);

      if (!itemToRemove) {
        log.debug(`Trying to remove ${symbol}, but it doesn't exist in the memory! Skipping.`);
        return;
      }

      const docRef = doc(
        FIREBASE_DB,
        FIREBASE_USERS_COLLECTION,
        userId,
        FIREBASE_WATCHLIST_COLLECTION,
        itemToRemove.id
      );

      await deleteDoc(docRef);

      set((state) => ({
        items: state.items.filter((item) => item.symbol !== symbol),
        forceFetch: true,
      }));

      log.debug(`${symbol} deleted from the watchlist for user: ${userId}`);
    } catch (error) {
      log.debug(`Error deleting ${symbol} from the watchlist for user: ${userId}`);
      log.error(error);
      throw error;
    }
  },

  getAllWatchlistedItems: async (userId) => {
    try {
      log.debug(`Fetching watchlists for user: ${userId}`);

      const { lastFetched } = get();
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

      if (lastFetched && lastFetched > fiveMinutesAgo) {
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
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        watchlistedItems.push({
          id: docSnap.id,
          symbol: data.symbol,
          createdAt: data.createdAt.toString(),
          shortName: data.shortName,
          longName: data.longName,
        });
      });

      set({
        items: watchlistedItems,
        lastFetched: new Date(),
      });

      log.debug(`Found ${watchlistedItems.length} watchlisted items for user: ${userId}`);
    } catch (error) {
      log.debug(`Error getting watchlisted items for user: ${userId}`);
      log.error(error);
      throw error;
    }
  },
}));
