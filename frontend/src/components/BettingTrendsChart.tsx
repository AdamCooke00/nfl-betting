import { memo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, Stack, Text } from './ui';
import { colors } from '../theme';

interface BettingTrendsChartProps {
  trendsData: Array<{
    week: string;
    'Home Win %': number;
    'Favorite Win %': number;
    'Over %': number;
  }>;
}

const BettingTrendsChart = ({ trendsData }: BettingTrendsChartProps) => {
  return (
    <Card>
      <Stack direction="column" gap="md">
        <Text size="lg" weight="semibold">
          League Betting Trends by Week
        </Text>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip
                formatter={(value) => [`${Number(value).toFixed(1)}%`, '']}
              />
              <Line
                type="monotone"
                dataKey="Home Win %"
                stroke={colors.chart.blue}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="Favorite Win %"
                stroke={colors.chart.green}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="Over %"
                stroke={colors.chart.red}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Stack>
    </Card>
  );
};

export default memo(BettingTrendsChart);
