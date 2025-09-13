import { useState } from 'react';
import { Stack, Text, Select, SelectItem } from './ui';
import TeamPerformanceSummary from './TeamPerformanceSummary';
import TeamPerformanceCharts from './TeamPerformanceCharts';
import Last5GamesChart from './Last5GamesChart';
import BettingTrendsChart from './BettingTrendsChart';
import { useTeamAnalytics } from '../hooks/useTeamAnalytics';

const AnalyticsDashboard = () => {
  const [selectedTeam, setSelectedTeam] = useState('KC');

  const { teamData, availableTeams, last5Data, trendsData } =
    useTeamAnalytics(selectedTeam);

  return (
    <Stack direction="column" gap="lg">
      <Stack
        direction="row"
        justify="between"
        align="center"
        className="flex-wrap gap-4"
      >
        <Text size="2xl" weight="bold">
          Analytics Dashboard
        </Text>
        <Select
          value={selectedTeam}
          onValueChange={(value) => setSelectedTeam(String(value))}
          className="min-w-24"
        >
          {availableTeams.map((team) => (
            <SelectItem key={team} value={team}>
              {team}
            </SelectItem>
          ))}
        </Select>
      </Stack>

      {/* Team Performance Summary */}
      <TeamPerformanceSummary teamData={teamData} />

      {/* Performance Charts */}
      <TeamPerformanceCharts selectedTeam={selectedTeam} teamData={teamData} />

      {/* Last 5 Games Performance */}
      <Last5GamesChart selectedTeam={selectedTeam} last5Data={last5Data} />

      {/* League Betting Trends */}
      <BettingTrendsChart trendsData={trendsData} />
    </Stack>
  );
};

export default AnalyticsDashboard;
