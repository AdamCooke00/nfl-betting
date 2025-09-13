import { memo, useMemo } from 'react';
import { Grid } from './ui';
import { StatCard } from './composite';

interface TeamPerformanceSummaryProps {
  teamData: {
    atsRecord: { wins: number; losses: number };
    overUnderRecord: { overs: number; unders: number };
  };
}

const TeamPerformanceSummary = ({ teamData }: TeamPerformanceSummaryProps) => {
  const atsWinPercentage = useMemo(() => {
    const total = teamData.atsRecord.wins + teamData.atsRecord.losses;
    return total > 0 ? Math.round((teamData.atsRecord.wins / total) * 100) : 0;
  }, [teamData.atsRecord.wins, teamData.atsRecord.losses]);

  const overPercentage = useMemo(() => {
    const total =
      teamData.overUnderRecord.overs + teamData.overUnderRecord.unders;
    return total > 0
      ? Math.round((teamData.overUnderRecord.overs / total) * 100)
      : 0;
  }, [teamData.overUnderRecord.overs, teamData.overUnderRecord.unders]);

  return (
    <Grid cols={1} gap="lg" responsive={{ md: 2, lg: 4 }}>
      <StatCard
        label="ATS Record"
        value={`${teamData.atsRecord.wins}-${teamData.atsRecord.losses}`}
        size="lg"
      />
      <StatCard label="ATS Win %" value={`${atsWinPercentage}%`} size="lg" />
      <StatCard
        label="O/U Record"
        value={`${teamData.overUnderRecord.overs}O-${teamData.overUnderRecord.unders}U`}
        size="lg"
      />
      <StatCard label="Over %" value={`${overPercentage}%`} size="lg" />
    </Grid>
  );
};

export default memo(TeamPerformanceSummary);
