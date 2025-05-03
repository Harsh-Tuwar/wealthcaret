// stores/usePortfolioStore.ts
import { create } from 'zustand';
import { Portfolio } from '@/types/types';

interface PortfolioState {
  portfolios: Portfolio[];
  lastFetched: Date | null;
  forceFetch: boolean;
  setPortfolios: (pfls: Portfolio[]) => void;
  setForceFetch: (value: boolean) => void;
  shouldRefetch: () => boolean;
}

export const usePortfolioStore = create<PortfolioState>((set, get) => ({
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
