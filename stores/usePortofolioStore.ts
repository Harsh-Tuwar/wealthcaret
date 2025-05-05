import { create } from 'zustand';
import { Portfolio } from '@/types/types';
import * as CollectionStrings from '../constants/Firebase';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';

import { FIREBASE_DB } from '../firebase';

import { log } from '@/utils/logger';

interface PortfolioStore {
	portfolios: Portfolio[];
	lastFetched: Date | null;
	forceFetch: boolean;

	setPortfolios: (portfolios: Portfolio[]) => void;
	setForceFetch: (value: boolean) => void;
	shouldRefetch: () => boolean;
}

enum PortfolioType {
	NONE = '0',
	CRYPTO = '1',
	STONKS = '2',
	MIXED = '3'
}

export const usePortfolioStore = create<PortfolioStore>((set, get) => ({
	portfolios: [],
	lastFetched: null,
	forceFetch: false,

	setPortfolios: (pfls) => {
		set({ portfolios: pfls, lastFetched: new Date() });
	},

	setForceFetch: (value) => {
		set({ forceFetch: value });
	},

	shouldRefetch: () => {
		const { lastFetched } = get();
		if (!lastFetched) return true;
		const fiveMinutesAgo = new Date(new Date().getTime() - 5 * 60 * 1000);
		return lastFetched > fiveMinutesAgo;
	},
}));

export const createNewPortfolio = async (portfolioName: string, type: PortfolioType, userId: string, isDefault = false) => {
	try {
		log.debug(`Creating new Portfolio for user: ${userId}`);

		await addDoc(collection(
			FIREBASE_DB,
			CollectionStrings.FIREBASE_USERS_COLLECTION,
			userId,
			CollectionStrings.FIRESTORE_PORTFOLIO_COLLECTION
		), {
			title: portfolioName,
			type,
			userId,
			createdAt: new Date(),
			default: isDefault
		});

		usePortfolioStore.getState().setForceFetch(true);

		log.debug(`Portfolio created successfully for user: ${userId}`)
	} catch (error) {
		log.debug(`Error creating new portfolio for user: ${userId}`);
		log.error(error);
		throw error;
	}
}

export const getPortfolios = async (userId: string) => {
	const pfls: Portfolio[] = [];

	try {
		log.debug(`Fetching portfolios for user: ${userId}`);

		const store = usePortfolioStore.getState();

		if (!store.shouldRefetch() && !store.forceFetch) {
			log.debug(`Skipping fetching portfolios!`);
			return;
		}

		const q = query(
			collection(
				FIREBASE_DB,
				CollectionStrings.FIREBASE_USERS_COLLECTION,
				userId,
				CollectionStrings.FIRESTORE_PORTFOLIO_COLLECTION
			),
			where('userId', '==', userId)
		);

		const querySnapshot = await getDocs(q);

		querySnapshot.forEach((doc) => {
			const data = doc.data();
			const pItem: Portfolio = {
				id: doc.id,
				title: data.title,
				type: data.type,
				userId: data.userId,
				createdAt: data.createdAt.toDate?.() ?? new Date(data.createdAt),
				default: data.default,
			};
			pfls.push(pItem);
		});

		log.debug(`Found ${pfls.length} portfolios for user: ${userId}`);
	} catch (error) {
		log.debug(`Error getting portfolios for user: ${userId}`);
		log.error(error);
		throw error;
	}

	return pfls;
};
