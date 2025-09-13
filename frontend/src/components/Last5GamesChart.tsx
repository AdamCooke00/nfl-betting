import { memo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, Stack, Text } from './ui';
import { colors } from '../theme';

interface Last5GamesChartProps {
  selectedTeam: string;
  last5Data: Array<{
    game: string;
    spread: number;
    actualMargin: number;
    covered: boolean;
  }>;
}

const Last5GamesChart = ({ selectedTeam, last5Data }: Last5GamesChartProps) => {
  return (
    <Card>
      <Stack direction="column" gap="md">
        <Text size="lg" weight="semibold">
          {selectedTeam} Last 5 Games - Spread Performance
        </Text>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={last5Data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="game" />
              <YAxis />
              <Tooltip
                formatter={(value, name) => [
                  `${Number(value) > 0 ? '+' : ''}${value}`,
                  name === 'spread' ? 'Spread' : 'Actual Margin',
                ]}
              />
              <Bar dataKey="spread" fill={colors.chart.gray} name="Spread" />
              <Bar
                dataKey="actualMargin"
                fill={colors.chart.blue}
                name="Actual Margin"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Stack>
    </Card>
  );
};

export default memo(Last5GamesChart);
