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

interface OddsData {
  time: string;
  spread: number;
  overUnder: number;
}

interface OddsChartProps {
  data: OddsData[];
  title: string;
}

const OddsChart = ({ data, title }: OddsChartProps) => {
  return (
    <Card>
      <Stack direction="column" gap="md">
        <Text size="lg" weight="semibold">
          {title}
        </Text>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="spread"
                stroke="#3B82F6"
                strokeWidth={2}
                name="Spread"
              />
              <Line
                type="monotone"
                dataKey="overUnder"
                stroke="#EF4444"
                strokeWidth={2}
                name="Over/Under"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Stack>
    </Card>
  );
};

export default OddsChart;
