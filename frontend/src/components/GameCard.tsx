import type { BettingData } from '../types';

interface GameCardProps {
  bettingData: BettingData;
}

const GameCard = ({ bettingData }: GameCardProps) => {
  const { game, odds, predictions } = bettingData;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const formatMoneyline = (line: number) => {
    return line > 0 ? `+${line}` : `${line}`;
  };

  const getSpreadDisplay = (spread: number, isHome: boolean) => {
    if (isHome) {
      return spread > 0 ? `+${spread}` : `${spread}`;
    } else {
      return spread > 0 ? `-${spread}` : `+${Math.abs(spread)}`;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-500">Week {game.week}</div>
        <div className="text-sm text-gray-500">{formatDate(game.gameTime)}</div>
      </div>

      {/* Teams */}
      <div className="space-y-3 mb-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <span className="font-semibold text-gray-900">
              {game.awayTeam.abbreviation}
            </span>
            <span className="text-gray-600">{game.awayTeam.city}</span>
          </div>
          <div className="text-sm text-gray-500">
            {getSpreadDisplay(odds.spread, false)}
          </div>
        </div>

        <div className="text-center text-gray-400 text-sm">at</div>

        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <span className="font-semibold text-gray-900">
              {game.homeTeam.abbreviation}
            </span>
            <span className="text-gray-600">{game.homeTeam.city}</span>
          </div>
          <div className="text-sm text-gray-500">
            {getSpreadDisplay(odds.spread, true)}
          </div>
        </div>
      </div>

      {/* Odds */}
      <div className="border-t border-gray-200 pt-4 mb-4">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="text-gray-500">O/U</div>
            <div className="font-semibold">{odds.overUnder}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-500">Away ML</div>
            <div className="font-semibold">
              {formatMoneyline(odds.awayMoneyline)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-gray-500">Home ML</div>
            <div className="font-semibold">
              {formatMoneyline(odds.homeMoneyline)}
            </div>
          </div>
        </div>
      </div>

      {/* Predictions */}
      {predictions && (
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Prediction
            </span>
            <span
              className={`text-sm px-2 py-1 rounded ${
                predictions.confidence > 0.7
                  ? 'bg-green-100 text-green-800'
                  : predictions.confidence > 0.6
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
              }`}
            >
              {Math.round(predictions.confidence * 100)}% confidence
            </span>
          </div>
          <div className="text-sm text-gray-600 mb-1">
            Pick:{' '}
            <span className="font-semibold">{predictions.predictedWinner}</span>
          </div>
          <div className="text-xs text-gray-500">{predictions.reasoning}</div>
        </div>
      )}

      {/* Status */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <span
          className={`inline-block px-2 py-1 rounded text-xs font-medium ${
            game.status === 'scheduled'
              ? 'bg-blue-100 text-blue-800'
              : game.status === 'in_progress'
                ? 'bg-orange-100 text-orange-800'
                : 'bg-gray-100 text-gray-800'
          }`}
        >
          {game.status.replace('_', ' ').toUpperCase()}
        </span>
      </div>
    </div>
  );
};

export default GameCard;
