import { Stack, Text, Select, SelectItem } from './ui';

interface WeekSelectorProps {
  selectedWeek: number;
  onWeekChange: (week: number) => void;
  season: number;
  availableWeeks?: number[];
}

const WeekSelector = ({
  selectedWeek,
  onWeekChange,
  season,
  availableWeeks = Array.from({ length: 18 }, (_, i) => i + 1),
}: WeekSelectorProps) => {
  const currentWeek =
    new Date().getMonth() < 2
      ? Math.min(
          18,
          Math.max(
            1,
            Math.floor(
              (Date.now() - new Date(`${season}-09-01`).getTime()) /
                (1000 * 60 * 60 * 24 * 7)
            ) + 1
          )
        )
      : 1;

  const quickLinks = [
    { label: 'Current Week', week: currentWeek },
    { label: 'Next Week', week: Math.min(18, currentWeek + 1) },
  ].filter((link) => availableWeeks.includes(link.week));

  return (
    <Stack direction="row" gap="md" align="center" className="flex-wrap">
      <Stack direction="column" gap="xs">
        <Text size="sm" weight="medium" color="secondary">
          Season {season}
        </Text>
        <Select
          value={selectedWeek}
          onValueChange={(value) => onWeekChange(Number(value))}
          placeholder="Select Week"
          className="min-w-32"
        >
          {availableWeeks.map((week) => (
            <SelectItem key={week} value={week}>
              Week {week}
            </SelectItem>
          ))}
        </Select>
      </Stack>

      {quickLinks.length > 0 && (
        <Stack direction="row" gap="xs" align="center">
          <Text size="sm" color="secondary">
            Quick:
          </Text>
          {quickLinks.map(({ label, week }) => (
            <button
              key={week}
              onClick={() => onWeekChange(week)}
              className="px-2 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
            >
              {label}
            </button>
          ))}
        </Stack>
      )}
    </Stack>
  );
};

export default WeekSelector;
