import { useMemo } from 'react';
import { mockTeamPerformance } from '../lib/mockData';

export const useTeams = () => {
  const availableTeams = useMemo(() => {
    return Object.keys(mockTeamPerformance).sort();
  }, []);

  const getTeamDisplayName = useMemo(() => {
    return (abbreviation: string) => {
      // Map of team abbreviations to full names
      const teamNames: Record<string, string> = {
        KC: 'Kansas City Chiefs',
        BUF: 'Buffalo Bills',
        DAL: 'Dallas Cowboys',
        SF: 'San Francisco 49ers',
        NYG: 'New York Giants',
        ARI: 'Arizona Cardinals',
        GB: 'Green Bay Packers',
        MIN: 'Minnesota Vikings',
        MIA: 'Miami Dolphins',
        NE: 'New England Patriots',
        DEN: 'Denver Broncos',
        LV: 'Las Vegas Raiders',
      };
      return teamNames[abbreviation] || abbreviation;
    };
  }, []);

  return {
    availableTeams,
    getTeamDisplayName,
  };
};