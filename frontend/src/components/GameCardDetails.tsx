import { memo } from 'react';
import type { BettingData } from '../types';
import { Stack, Grid, Text, BettingButton } from './ui';
import { useBettingCalculations } from '../hooks/useBettingCalculations';
import { getValueAssessment } from '../lib/betting';

interface GameCardDetailsProps {
  bettingData: BettingData;
}

const GameCardDetails = ({ bettingData }: GameCardDetailsProps) => {
  const { game, odds, predictions } = bettingData;
  const { calculateImpliedProbability, formatPercentage } =
    useBettingCalculations();

  return (
    <Stack direction="column" gap="md">
      <Text size="sm" weight="medium" color="secondary">
        Detailed Analysis
      </Text>

      {/* Additional Stats Grid */}
      <Grid cols={2} gap="md">
        <Stack direction="column" gap="xs">
          <Text size="xs" color="secondary">
            Implied Probability
          </Text>
          <Text size="sm" weight="semibold">
            Home:{' '}
            {formatPercentage(calculateImpliedProbability(odds.homeMoneyline))}
          </Text>
          <Text size="sm" weight="semibold">
            Away:{' '}
            {formatPercentage(calculateImpliedProbability(odds.awayMoneyline))}
          </Text>
        </Stack>
        <Stack direction="column" gap="xs">
          <Text size="xs" color="secondary">
            Value Assessment
          </Text>
          <Text size="sm" weight="semibold">
            {getValueAssessment(predictions?.confidence)}
          </Text>
          <Text size="xs" color="secondary">
            Last Updated: {new Date(odds.lastUpdated).toLocaleDateString()}
          </Text>
        </Stack>
      </Grid>

      {/* Betting Actions */}
      <Stack direction="row" gap="xs" className="flex-wrap">
        <BettingButton
          variant="home"
          onClick={() =>
            alert(`Tracking ${game.homeTeam.abbreviation} spread bet`)
          }
        >
          Track Home Spread
        </BettingButton>
        <BettingButton
          variant="away"
          onClick={() =>
            alert(`Tracking ${game.awayTeam.abbreviation} spread bet`)
          }
        >
          Track Away Spread
        </BettingButton>
        <BettingButton
          variant="total"
          onClick={() => alert(`Tracking O/U ${odds.overUnder} bet`)}
        >
          Track O/U
        </BettingButton>
      </Stack>

      {/* Historical Matchup Info */}
      <Stack direction="column" gap="xs">
        <Text size="xs" color="secondary">
          Season Series & Trends
        </Text>
        <Stack direction="row" justify="between">
          <Text size="xs">Head-to-head this season: 0-0</Text>
          <Text size="xs">
            Last 5 meetings: 3-2 {game.homeTeam.abbreviation}
          </Text>
        </Stack>
        <Stack direction="row" justify="between">
          <Text size="xs">{game.homeTeam.abbreviation} home ATS: 4-2</Text>
          <Text size="xs">{game.awayTeam.abbreviation} away ATS: 3-3</Text>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default memo(GameCardDetails);
