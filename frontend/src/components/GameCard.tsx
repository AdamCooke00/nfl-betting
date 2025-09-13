import type { BettingData } from '../types';
import { Card, Stack, Grid, Text, Badge, Divider } from './ui';
import { StatCard } from './composite';

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

  const getConfidenceBadgeVariant = (confidence: number) => {
    if (confidence > 0.7) return 'success';
    if (confidence > 0.6) return 'warning';
    return 'error';
  };

  const getStatusBadgeVariant = (status: string) => {
    if (status === 'scheduled') return 'primary';
    if (status === 'in_progress') return 'warning';
    return 'neutral';
  };

  return (
    <Card variant="elevated">
      <Stack direction="column" gap="md">
        {/* Header */}
        <Stack direction="row" justify="between" align="center">
          <Text size="sm" color="secondary">
            Week {game.week}
          </Text>
          <Text size="sm" color="secondary">
            {formatDate(game.gameTime)}
          </Text>
        </Stack>

        {/* Teams */}
        <Stack direction="column" gap="sm">
          <Stack direction="row" justify="between" align="center">
            <Stack direction="row" gap="sm" align="center">
              <Text weight="semibold">{game.awayTeam.abbreviation}</Text>
              <Text color="secondary">{game.awayTeam.city}</Text>
            </Stack>
            <Text size="sm" color="secondary">
              {getSpreadDisplay(odds.spread, false)}
            </Text>
          </Stack>

          <Text size="sm" color="secondary" align="center">
            at
          </Text>

          <Stack direction="row" justify="between" align="center">
            <Stack direction="row" gap="sm" align="center">
              <Text weight="semibold">{game.homeTeam.abbreviation}</Text>
              <Text color="secondary">{game.homeTeam.city}</Text>
            </Stack>
            <Text size="sm" color="secondary">
              {getSpreadDisplay(odds.spread, true)}
            </Text>
          </Stack>
        </Stack>

        {/* Odds */}
        <Divider spacing="none" />
        <Grid cols={3} gap="md">
          <StatCard label="O/U" value={odds.overUnder} size="sm" />
          <StatCard
            label="Away ML"
            value={formatMoneyline(odds.awayMoneyline)}
            size="sm"
          />
          <StatCard
            label="Home ML"
            value={formatMoneyline(odds.homeMoneyline)}
            size="sm"
          />
        </Grid>

        {/* Predictions */}
        {predictions && (
          <>
            <Divider spacing="none" />
            <Stack direction="column" gap="xs">
              <Stack direction="row" justify="between" align="center">
                <Text size="sm" weight="medium" color="secondary">
                  Prediction
                </Text>
                <Badge
                  variant={getConfidenceBadgeVariant(predictions.confidence)}
                  size="sm"
                >
                  {Math.round(predictions.confidence * 100)}% confidence
                </Badge>
              </Stack>
              <Stack direction="row" gap="xs" align="center">
                <Text size="sm" color="secondary">
                  Pick:
                </Text>
                <Text size="sm" weight="semibold">
                  {predictions.predictedWinner}
                </Text>
              </Stack>
              <Text size="xs" color="secondary">
                {predictions.reasoning}
              </Text>
            </Stack>
          </>
        )}

        {/* Status */}
        <Divider spacing="none" />
        <Badge variant={getStatusBadgeVariant(game.status)} size="sm">
          {game.status.replace('_', ' ').toUpperCase()}
        </Badge>
      </Stack>
    </Card>
  );
};

export default GameCard;
