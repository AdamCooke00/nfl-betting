// Mock data for development - DELETE THIS FILE when connecting to real backend
import type { BettingData } from '../types';

const generateGameId = (week: number, homeTeam: string, awayTeam: string) =>
  `2025_${week.toString().padStart(2, '0')}_${awayTeam}_${homeTeam}`;

const teams = [
  { id: 'kc', name: 'Chiefs', city: 'Kansas City', abbreviation: 'KC' },
  { id: 'buf', name: 'Bills', city: 'Buffalo', abbreviation: 'BUF' },
  { id: 'dal', name: 'Cowboys', city: 'Dallas', abbreviation: 'DAL' },
  { id: 'nyg', name: 'Giants', city: 'New York', abbreviation: 'NYG' },
  { id: 'sf', name: '49ers', city: 'San Francisco', abbreviation: 'SF' },
  { id: 'ari', name: 'Cardinals', city: 'Arizona', abbreviation: 'ARI' },
  { id: 'gb', name: 'Packers', city: 'Green Bay', abbreviation: 'GB' },
  { id: 'min', name: 'Vikings', city: 'Minnesota', abbreviation: 'MIN' },
  { id: 'mia', name: 'Dolphins', city: 'Miami', abbreviation: 'MIA' },
  { id: 'ne', name: 'Patriots', city: 'New England', abbreviation: 'NE' },
  { id: 'den', name: 'Broncos', city: 'Denver', abbreviation: 'DEN' },
  { id: 'lv', name: 'Raiders', city: 'Las Vegas', abbreviation: 'LV' },
];

const generateMockGamesForWeek = (week: number): BettingData[] => {
  const weekOffset = (week - 1) * 7;
  const gameDate = new Date('2025-09-07');
  gameDate.setDate(gameDate.getDate() + weekOffset);

  const gamesThisWeek: BettingData[] = [];
  const shuffledTeams = [...teams].sort(() => Math.random() - 0.5);

  for (let i = 0; i < Math.min(6, shuffledTeams.length - 1); i += 2) {
    const homeTeam = shuffledTeams[i];
    const awayTeam = shuffledTeams[i + 1];
    const gameId = generateGameId(
      week,
      homeTeam.abbreviation,
      awayTeam.abbreviation
    );

    const spread = (Math.random() * 14 - 7).toFixed(1);
    const total = (Math.random() * 20 + 35).toFixed(1);
    const confidence = Math.random() * 0.3 + 0.55;

    const gameTime = new Date(gameDate);
    gameTime.setHours(13 + (i / 2) * 3, Math.floor(Math.random() * 60));

    gamesThisWeek.push({
      game: {
        id: gameId,
        homeTeam,
        awayTeam,
        gameTime: gameTime.toISOString(),
        week,
        season: 2025,
        status:
          week < 3
            ? 'scheduled'
            : Math.random() > 0.7
              ? 'completed'
              : 'scheduled',
      },
      odds: {
        gameId,
        spread: parseFloat(spread),
        overUnder: parseFloat(total),
        homeMoneyline:
          parseFloat(spread) < 0
            ? -150 - Math.abs(parseFloat(spread)) * 20
            : 120 + Math.abs(parseFloat(spread)) * 15,
        awayMoneyline:
          parseFloat(spread) > 0
            ? -150 - parseFloat(spread) * 20
            : 120 + parseFloat(spread) * 15,
        lastUpdated: new Date().toISOString(),
      },
      predictions: {
        confidence,
        predictedWinner:
          parseFloat(spread) < 0
            ? homeTeam.abbreviation
            : awayTeam.abbreviation,
        reasoning: [
          'Strong offensive line and home field advantage',
          'Superior roster depth and recent performance trends',
          'Dominant defense and significant talent gap',
          'Key injuries favor this matchup',
          'Historical head-to-head advantage',
          'Weather conditions favor running game',
        ][Math.floor(Math.random() * 6)],
      },
    });
  }

  return gamesThisWeek;
};

export const mockBettingDataByWeek: Record<number, BettingData[]> = {};
for (let week = 1; week <= 5; week++) {
  mockBettingDataByWeek[week] = generateMockGamesForWeek(week);
}

export const mockBettingData: BettingData[] = mockBettingDataByWeek[1] || [];

// Mock analytics data
export const mockTeamPerformance = {
  KC: {
    atsRecord: { wins: 8, losses: 4, pushes: 0 },
    overUnderRecord: { overs: 6, unders: 6, pushes: 0 },
    last5Games: [
      {
        week: 1,
        opponent: 'BUF',
        result: 'W',
        atsResult: 'W',
        spread: -3.5,
        actualMargin: 7,
      },
      {
        week: 2,
        opponent: 'DAL',
        result: 'W',
        atsResult: 'L',
        spread: -7,
        actualMargin: 3,
      },
      {
        week: 3,
        opponent: 'SF',
        result: 'L',
        atsResult: 'W',
        spread: 2.5,
        actualMargin: -3,
      },
      {
        week: 4,
        opponent: 'GB',
        result: 'W',
        atsResult: 'W',
        spread: -1,
        actualMargin: 10,
      },
      {
        week: 5,
        opponent: 'MIA',
        result: 'W',
        atsResult: 'L',
        spread: -6,
        actualMargin: 3,
      },
    ],
  },
  BUF: {
    atsRecord: { wins: 6, losses: 6, pushes: 0 },
    overUnderRecord: { overs: 7, unders: 5, pushes: 0 },
    last5Games: [
      {
        week: 1,
        opponent: 'KC',
        result: 'L',
        atsResult: 'L',
        spread: 3.5,
        actualMargin: -7,
      },
      {
        week: 2,
        opponent: 'NE',
        result: 'W',
        atsResult: 'W',
        spread: -9,
        actualMargin: 14,
      },
      {
        week: 3,
        opponent: 'MIA',
        result: 'W',
        atsResult: 'W',
        spread: -3,
        actualMargin: 7,
      },
      {
        week: 4,
        opponent: 'NYG',
        result: 'W',
        atsResult: 'L',
        spread: -12,
        actualMargin: 6,
      },
      {
        week: 5,
        opponent: 'DEN',
        result: 'L',
        atsResult: 'W',
        spread: -7,
        actualMargin: -3,
      },
    ],
  },
  DAL: {
    atsRecord: { wins: 7, losses: 5, pushes: 0 },
    overUnderRecord: { overs: 8, unders: 4, pushes: 0 },
    last5Games: [
      {
        week: 1,
        opponent: 'NYG',
        result: 'W',
        atsResult: 'W',
        spread: -6,
        actualMargin: 10,
      },
      {
        week: 2,
        opponent: 'KC',
        result: 'L',
        atsResult: 'W',
        spread: 7,
        actualMargin: -3,
      },
      {
        week: 3,
        opponent: 'ARI',
        result: 'W',
        atsResult: 'L',
        spread: -4,
        actualMargin: 3,
      },
      {
        week: 4,
        opponent: 'SF',
        result: 'L',
        atsResult: 'L',
        spread: 3,
        actualMargin: -7,
      },
      {
        week: 5,
        opponent: 'GB',
        result: 'W',
        atsResult: 'W',
        spread: -2,
        actualMargin: 14,
      },
    ],
  },
  SF: {
    atsRecord: { wins: 9, losses: 3, pushes: 0 },
    overUnderRecord: { overs: 5, unders: 7, pushes: 0 },
    last5Games: [
      {
        week: 1,
        opponent: 'ARI',
        result: 'W',
        atsResult: 'W',
        spread: -7,
        actualMargin: 21,
      },
      {
        week: 2,
        opponent: 'GB',
        result: 'W',
        atsResult: 'L',
        spread: -3,
        actualMargin: 2,
      },
      {
        week: 3,
        opponent: 'KC',
        result: 'W',
        atsResult: 'L',
        spread: -2.5,
        actualMargin: 3,
      },
      {
        week: 4,
        opponent: 'DAL',
        result: 'W',
        atsResult: 'W',
        spread: -3,
        actualMargin: 7,
      },
      {
        week: 5,
        opponent: 'MIA',
        result: 'L',
        atsResult: 'W',
        spread: -1,
        actualMargin: -3,
      },
    ],
  },
};

export const mockBettingTrends = [
  { week: 1, homeWinRate: 0.65, favoriteWinRate: 0.58, overRate: 0.52 },
  { week: 2, homeWinRate: 0.62, favoriteWinRate: 0.61, overRate: 0.48 },
  { week: 3, homeWinRate: 0.59, favoriteWinRate: 0.55, overRate: 0.54 },
  { week: 4, homeWinRate: 0.61, favoriteWinRate: 0.63, overRate: 0.51 },
  { week: 5, homeWinRate: 0.58, favoriteWinRate: 0.59, overRate: 0.49 },
];
