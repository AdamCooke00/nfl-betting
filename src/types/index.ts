// Basic types for NFL betting data
export interface Team {
  id: string;
  name: string;
  city: string;
  abbreviation: string;
}

export interface Game {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  gameTime: string;
  week: number;
  season: number;
  status: 'scheduled' | 'in_progress' | 'completed';
}

export interface BettingOdds {
  gameId: string;
  spread: number;
  overUnder: number;
  homeMoneyline: number;
  awayMoneyline: number;
  lastUpdated: string;
}

export interface BettingData {
  game: Game;
  odds: BettingOdds;
  predictions?: {
    confidence: number;
    predictedWinner: string;
    reasoning: string;
  };
}
