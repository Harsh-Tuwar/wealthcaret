// txStore.ts
import { create } from 'zustand';
import { FIREBASE_DB } from '@/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { FIREBASE_USERS_COLLECTION, FIRESTORE_PORTFOLIO_COLLECTION } from '@/constants/Firebase';
import { log } from '@/utils/logger';

export enum BuyPriceType {
  IN_TOTAL = '0',
  PER_UNIT = '1'
}

export interface FSTxItem {
  dt: string;
  id?: string;
  buyPrice: string;
  buyType: BuyPriceType;
  amountBought: string;
  portfolioId: string;
  symbol: string;
  txFees?: string;
  boughtVia?: string;
  notes?: string;
  createdAt?: string;
}

interface TxStoreState {
  txs: FSTxItem[];
  lastFetched: null;
  forceFetch: boolean;
  addTransaction: (txData: FSTxItem, userId: string) => Promise<void>;
}

export const useTxStore = create<TxStoreState>((set) => ({
  txs: [],
  lastFetched: null,
  forceFetch: false,

  addTransaction: async (txData: FSTxItem, userId: string) => {
    try {
      log.debug(`Adding new tx for ${txData.symbol} for the user: ${userId}`);
      const itemCreationDate = new Date();

      const newDocData = await addDoc(collection(
        FIREBASE_DB,
        FIREBASE_USERS_COLLECTION,
        userId,
        FIRESTORE_PORTFOLIO_COLLECTION,
        txData.portfolioId,
        txData.symbol
      ), {
        ...txData,
        symbol: txData.symbol,
        createdAt: itemCreationDate,
      });

      set((state) => ({
        txs: [
          ...state.txs,
          {
            ...txData,
            id: newDocData.id,
            createdAt: itemCreationDate.toString(),
            symbol: txData.symbol
          }
        ],
        forceFetch: true
      }));

      log.debug(`Added new transaction for ${txData.symbol} for user: ${userId}`);
    } catch (error) {
      log.debug(`Error adding new transaction for ${txData.symbol} to the user: ${userId}`);
      log.error(error);
      throw error;
    }
  }
}));
