import useSWR from 'swr';
import { fetcher, apiEndpoints } from '../lib/api';
import { mockBettingData } from '../lib/mockData'; // DELETE THIS LINE when connecting to real backend
import type { BettingData } from '../types';

export const useBettingData = (week?: number) => {
  // MOCK DATA SETUP - Remove this section when connecting to real backend
  const useMockData = import.meta.env.MODE === 'development';

  const { data, error, isLoading, mutate } = useSWR<BettingData[]>(
    week
      ? `${apiEndpoints.bettingData}?week=${week}`
      : apiEndpoints.bettingData,
    useMockData ? null : fetcher, // Use null fetcher for mock data
    {
      fallbackData: useMockData ? mockBettingData : undefined, // Use mock data in development
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
    }
  );

  return {
    bettingData: data || [],
    isLoading: useMockData ? false : isLoading,
    error,
    refreshData: mutate,
  };
};
