import { useMemo } from 'react';
import { mockTeamPerformance, mockBettingTrends } from '../lib/mockData';
import { useTeams } from './useTeams';

export const useTeamAnalytics = (selectedTeam: string) => {
  const { availableTeams } = useTeams();

  const teamData = useMemo(() => {
    return mockTeamPerformance[
      selectedTeam as keyof typeof mockTeamPerformance
    ];
  }, [selectedTeam]);

  const last5Data = useMemo(() => {
    if (!teamData) return [];
    return teamData.last5Games.map((game) => ({
      game: `W${game.week}`,
      spread: game.spread,
      actualMargin: game.actualMargin,
      covered: game.atsResult === 'W',
    }));
  }, [teamData]);

  const trendsData = useMemo(() => {
    return mockBettingTrends.map((trend) => ({
      week: `W${trend.week}`,
      'Home Win %': trend.homeWinRate * 100,
      'Favorite Win %': trend.favoriteWinRate * 100,
      'Over %': trend.overRate * 100,
    }));
  }, []);

  const atsWinPercentage = useMemo(() => {
    if (!teamData) return 0;
    const total = teamData.atsRecord.wins + teamData.atsRecord.losses;
    return total > 0 ? Math.round((teamData.atsRecord.wins / total) * 100) : 0;
  }, [teamData]);

  const overPercentage = useMemo(() => {
    if (!teamData) return 0;
    const total =
      teamData.overUnderRecord.overs + teamData.overUnderRecord.unders;
    return total > 0
      ? Math.round((teamData.overUnderRecord.overs / total) * 100)
      : 0;
  }, [teamData]);

  return {
    teamData,
    availableTeams,
    last5Data,
    trendsData,
    atsWinPercentage,
    overPercentage,
  };
};
