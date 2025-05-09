// watchlistStore.ts

import { create } from 'zustand';
import { FIREBASE_DB } from '@/firebase';
import { log } from '@/utils/logger';
import { collection, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore';
import { FIREBASE_WATCHLIST_COLLECTION, FIREBASE_WATCHLIST_ITEM_COLLECTION } from '@/constants/Firebase';
import { useAuthStore } from './useAuthStore';

export interface WatchlistItem {
  symbol: string;
  createdAt: string;
  id: string;
  name: string;
  exchange: string
}

interface WatchlistState {
  items: WatchlistItem[];
  lastFetched: Date | null;
  forceFetch: boolean;

  toggleWatchlistItem: (symbol: string, name: string, exchange: string, userId: string) => Promise<boolean>;
  getAllWatchlistedItems: (userId: string) => Promise<void>;
}

export const useWatchlistStore = create<WatchlistState>((set, get) => ({
  items: [],
  lastFetched: null,
  forceFetch: false,

  toggleWatchlistItem: async (symbol, name, exchange, userId) => {
    if (!userId) {
      log.debug('Cannot toggle symbol in watchlist: user ID is undefined.');
      return false;
    }

    if (!symbol || !name || !exchange) {
      log.debug('Missing required fields for toggling watchlist item.');
      return false;
    }

    const { items } = get();
    const existsInWatchlist = items.some((item) => item.symbol === symbol);

    const docRef = doc(
      FIREBASE_DB,
      FIREBASE_WATCHLIST_COLLECTION, // e.g., "watchlists"
      userId,
      FIREBASE_WATCHLIST_ITEM_COLLECTION, // e.g., "items"
      symbol
    );

    try {
      if (existsInWatchlist) {
        log.debug(`Removing ${symbol} from watchlist for user: ${userId}`);
        await deleteDoc(docRef);

        set((state) => ({
          items: state.items.filter((item) => item.symbol !== symbol),
          forceFetch: true,
        }));

        log.debug(`${symbol} successfully removed from watchlist for user: ${userId}`);
        return true;
      } else {
        log.debug(`Adding ${symbol} to watchlist for user: ${userId}`);
        const createdAt = new Date().toISOString();

        await setDoc(docRef, {
          symbol,
          name,
          exchange,
          createdAt,
        });

        set((state) => ({
          items: [
            ...state.items,
            {
              symbol,
              name,
              exchange,
              createdAt,
              id: symbol, // symbol used as document ID
            },
          ],
          forceFetch: true,
        }));

        log.debug(`${symbol} successfully added to watchlist for user: ${userId}`);
        return true;
      }
    } catch (error) {
      log.error(`Error toggling ${symbol} in watchlist for user: ${userId}`, error);
      return false;
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
        FIREBASE_WATCHLIST_COLLECTION,
        userId,
        FIREBASE_WATCHLIST_ITEM_COLLECTION,
      );

      const querySnapshot = await getDocs(collectionRef);

      const watchlistedItems: WatchlistItem[] = [];

      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();

        watchlistedItems.push({
          id: docSnap.id,
          symbol: data.symbol,
          createdAt: data.createdAt.toString(),
          name: data.name,
          exchange: data.exchange,
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
