import { useBettingData } from '../hooks/useBettingData';
import GameCard from './GameCard';

const Dashboard = () => {
  const { bettingData, isLoading, error, refreshData } = useBettingData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-lg text-gray-600">Loading betting data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="text-red-800">
          Error loading data: {error.message}
          <button
            onClick={() => refreshData()}
            className="ml-2 text-red-600 hover:text-red-800 underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          NFL Betting Dashboard
        </h1>
        <button
          onClick={() => refreshData()}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bettingData.map((data) => (
          <GameCard key={data.game.id} bettingData={data} />
        ))}
      </div>

      {bettingData.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No betting data available for this week.
        </div>
      )}
    </div>
  );
};

export default Dashboard;
