import { useBettingData } from '../hooks/useBettingData';
import GameCard from './GameCard';
import { Stack, Grid, Text, Button } from './ui';
import { LoadingState, ErrorState, EmptyState } from './composite';

const Dashboard = () => {
  const { bettingData, isLoading, error, refreshData } = useBettingData();

  if (isLoading) {
    return <LoadingState message="Loading betting data..." />;
  }

  if (error) {
    return <ErrorState message={error.message} onRetry={refreshData} />;
  }

  return (
    <Stack direction="column" gap="lg">
      <Stack direction="row" justify="between" align="center">
        <Text size="3xl" weight="bold">
          NFL Betting Dashboard
        </Text>
        <Button onClick={() => refreshData()}>Refresh</Button>
      </Stack>

      {bettingData.length === 0 ? (
        <EmptyState message="No betting data available for this week." />
      ) : (
        <Grid
          cols={1}
          gap="lg"
          responsive={{
            md: 2,
            lg: 3,
          }}
        >
          {bettingData.map((data) => (
            <GameCard key={data.game.id} bettingData={data} />
          ))}
        </Grid>
      )}
    </Stack>
  );
};

export default Dashboard;
