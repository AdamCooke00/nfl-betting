// Mock data for development - DELETE THIS FILE when connecting to real backend
import type { BettingData } from '../types';

export const mockBettingData: BettingData[] = [
  {
    game: {
      id: '1',
      homeTeam: {
        id: 'kc',
        name: 'Chiefs',
        city: 'Kansas City',
        abbreviation: 'KC',
      },
      awayTeam: {
        id: 'buf',
        name: 'Bills',
        city: 'Buffalo',
        abbreviation: 'BUF',
      },
      gameTime: '2025-09-07T20:20:00Z',
      week: 1,
      season: 2025,
      status: 'scheduled',
    },
    odds: {
      gameId: '1',
      spread: -3.5,
      overUnder: 47.5,
      homeMoneyline: -180,
      awayMoneyline: +155,
      lastUpdated: '2025-09-06T22:00:00Z',
    },
    predictions: {
      confidence: 0.72,
      predictedWinner: 'KC',
      reasoning: 'Strong offensive line and home field advantage',
    },
  },
  {
    game: {
      id: '2',
      homeTeam: {
        id: 'dal',
        name: 'Cowboys',
        city: 'Dallas',
        abbreviation: 'DAL',
      },
      awayTeam: {
        id: 'nyg',
        name: 'Giants',
        city: 'New York',
        abbreviation: 'NYG',
      },
      gameTime: '2025-09-08T17:00:00Z',
      week: 1,
      season: 2025,
      status: 'scheduled',
    },
    odds: {
      gameId: '2',
      spread: -7.0,
      overUnder: 44.0,
      homeMoneyline: -320,
      awayMoneyline: +260,
      lastUpdated: '2025-09-06T22:00:00Z',
    },
    predictions: {
      confidence: 0.68,
      predictedWinner: 'DAL',
      reasoning: 'Superior roster depth and recent performance trends',
    },
  },
  {
    game: {
      id: '3',
      homeTeam: {
        id: 'sf',
        name: '49ers',
        city: 'San Francisco',
        abbreviation: 'SF',
      },
      awayTeam: {
        id: 'ari',
        name: 'Cardinals',
        city: 'Arizona',
        abbreviation: 'ARI',
      },
      gameTime: '2025-09-08T21:30:00Z',
      week: 1,
      season: 2025,
      status: 'scheduled',
    },
    odds: {
      gameId: '3',
      spread: -14.5,
      overUnder: 41.0,
      homeMoneyline: -650,
      awayMoneyline: +485,
      lastUpdated: '2025-09-06T22:00:00Z',
    },
    predictions: {
      confidence: 0.85,
      predictedWinner: 'SF',
      reasoning: 'Dominant defense and significant talent gap',
    },
  },
];
