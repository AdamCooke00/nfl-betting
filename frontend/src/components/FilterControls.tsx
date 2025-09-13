import { Stack, Text, Select, SelectItem } from './ui';
import type { BettingData } from '../types';
import { useTeams } from '../hooks/useTeams';

export interface FilterState {
  sortBy: 'gameTime' | 'spread' | 'total' | 'confidence';
  sortOrder: 'asc' | 'desc';
  teamFilter: string;
  statusFilter: string;
}

interface FilterControlsProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  bettingData: BettingData[];
}

const FilterControls = ({
  filters,
  onFiltersChange,
  bettingData,
}: FilterControlsProps) => {
  const { availableTeams } = useTeams();

  const availableStatuses = Array.from(
    new Set(bettingData.map((data) => data.game.status))
  ).sort();

  return (
    <Stack direction="row" gap="md" align="center" className="flex-wrap">
      <Stack direction="column" gap="xs">
        <Text size="sm" weight="medium" color="secondary">
          Sort by
        </Text>
        <Select
          value={filters.sortBy}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              sortBy: value as FilterState['sortBy'],
            })
          }
          className="min-w-32"
        >
          <SelectItem value="gameTime">Game Time</SelectItem>
          <SelectItem value="spread">Spread</SelectItem>
          <SelectItem value="total">Total</SelectItem>
          <SelectItem value="confidence">Confidence</SelectItem>
        </Select>
      </Stack>

      <Stack direction="column" gap="xs">
        <Text size="sm" weight="medium" color="secondary">
          Order
        </Text>
        <Select
          value={filters.sortOrder}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              sortOrder: value as FilterState['sortOrder'],
            })
          }
          className="min-w-24"
        >
          <SelectItem value="asc">Low to High</SelectItem>
          <SelectItem value="desc">High to Low</SelectItem>
        </Select>
      </Stack>

      <Stack direction="column" gap="xs">
        <Text size="sm" weight="medium" color="secondary">
          Team
        </Text>
        <Select
          value={filters.teamFilter}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, teamFilter: String(value) })
          }
          className="min-w-24"
        >
          <SelectItem value="">All Teams</SelectItem>
          {availableTeams.map((team) => (
            <SelectItem key={team} value={team}>
              {team}
            </SelectItem>
          ))}
        </Select>
      </Stack>

      {availableStatuses.length > 1 && (
        <Stack direction="column" gap="xs">
          <Text size="sm" weight="medium" color="secondary">
            Status
          </Text>
          <Select
            value={filters.statusFilter}
            onValueChange={(value) =>
              onFiltersChange({ ...filters, statusFilter: String(value) })
            }
            className="min-w-28"
          >
            <SelectItem value="">All Games</SelectItem>
            {availableStatuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status.replace('_', ' ').toUpperCase()}
              </SelectItem>
            ))}
          </Select>
        </Stack>
      )}

      {(filters.teamFilter || filters.statusFilter) && (
        <button
          onClick={() =>
            onFiltersChange({
              ...filters,
              teamFilter: '',
              statusFilter: '',
            })
          }
          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
        >
          Clear Filters
        </button>
      )}
    </Stack>
  );
};

export default FilterControls;
