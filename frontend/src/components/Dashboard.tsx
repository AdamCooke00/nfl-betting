import { useState } from 'react';
import { useBettingData } from '../hooks/useBettingData';
import GameCard from './GameCard';
import WeekSelector from './WeekSelector';
import FilterControls, { type FilterState } from './FilterControls';
import { Stack, Grid, Text, Button } from './ui';
import { LoadingState, ErrorState, EmptyState } from './composite';
import { sortAndFilterBettingData } from '../lib/utils';

const Dashboard = () => {
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [filters, setFilters] = useState<FilterState>({
    sortBy: 'gameTime',
    sortOrder: 'asc',
    teamFilter: '',
    statusFilter: '',
  });

  const { bettingData, isLoading, error, refreshData } =
    useBettingData(selectedWeek);
  const filteredAndSortedData = sortAndFilterBettingData(bettingData, filters);

  if (isLoading) {
    return <LoadingState message="Loading betting data..." />;
  }

  if (error) {
    return <ErrorState message={error.message} onRetry={refreshData} />;
  }

  return (
    <Stack direction="column" gap="lg">
      <Stack
        direction="row"
        justify="between"
        align="center"
        className="flex-wrap gap-4"
      >
        <Text size="3xl" weight="bold">
          NFL Betting Dashboard
        </Text>
        <Button onClick={() => refreshData()}>Refresh</Button>
      </Stack>

      <WeekSelector
        selectedWeek={selectedWeek}
        onWeekChange={setSelectedWeek}
        season={2025}
        availableWeeks={[1, 2, 3, 4, 5]}
      />

      <FilterControls
        filters={filters}
        onFiltersChange={setFilters}
        bettingData={bettingData}
      />

      {filteredAndSortedData.length === 0 ? (
        <EmptyState
          message={
            bettingData.length === 0
              ? 'No betting data available for this week.'
              : 'No games match the current filters.'
          }
        />
      ) : (
        <Grid
          cols={1}
          gap="lg"
          responsive={{
            md: 2,
            lg: 3,
          }}
        >
          {filteredAndSortedData.map((data) => (
            <GameCard key={data.game.id} bettingData={data} />
          ))}
        </Grid>
      )}
    </Stack>
  );
};

export default Dashboard;
