// API utility functions and fetchers

// Base API URL - this should be configurable
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Generic fetcher function for SWR
export const fetcher = async (url: string) => {
  const response = await fetch(`${API_BASE_URL}${url}`);
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  return response.json();
};

// API endpoint functions
export const apiEndpoints = {
  games: '/api/games',
  odds: '/api/odds',
  predictions: '/api/predictions',
  bettingData: '/api/betting-data',
};
