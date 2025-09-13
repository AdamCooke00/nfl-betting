import { memo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Grid, Card, Stack, Text } from './ui';
import { colors } from '../theme';

interface TeamPerformanceChartsProps {
  selectedTeam: string;
  teamData: {
    atsRecord: { wins: number; losses: number; pushes: number };
    overUnderRecord: { overs: number; unders: number };
  };
}

const TeamPerformanceCharts = ({
  selectedTeam,
  teamData,
}: TeamPerformanceChartsProps) => {
  const atsData = [
    { name: 'Wins', value: teamData.atsRecord.wins, fill: colors.chart.green },
    {
      name: 'Losses',
      value: teamData.atsRecord.losses,
      fill: colors.chart.red,
    },
    {
      name: 'Pushes',
      value: teamData.atsRecord.pushes,
      fill: colors.chart.gray,
    },
  ];

  const overUnderData = [
    {
      name: 'Overs',
      value: teamData.overUnderRecord.overs,
      fill: colors.chart.red,
    },
    {
      name: 'Unders',
      value: teamData.overUnderRecord.unders,
      fill: colors.chart.blue,
    },
    { name: 'Pushes', value: 0, fill: colors.chart.gray },
  ];

  return (
    <Grid cols={1} gap="lg" responsive={{ lg: 2 }}>
      {/* ATS Performance Pie Chart */}
      <Card>
        <Stack direction="column" gap="md">
          <Text size="lg" weight="semibold">
            {selectedTeam} Against The Spread
          </Text>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={atsData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {atsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Stack>
      </Card>

      {/* Over/Under Performance Pie Chart */}
      <Card>
        <Stack direction="column" gap="md">
          <Text size="lg" weight="semibold">
            {selectedTeam} Over/Under Performance
          </Text>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={overUnderData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {overUnderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Stack>
      </Card>
    </Grid>
  );
};

export default memo(TeamPerformanceCharts);
