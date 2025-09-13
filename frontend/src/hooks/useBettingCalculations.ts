import { useMemo } from 'react';

export const useBettingCalculations = () => {
  const calculateImpliedProbability = useMemo(() => {
    return (odds: number) => {
      if (odds > 0) {
        return 100 / (odds + 100);
      } else {
        return Math.abs(odds) / (Math.abs(odds) + 100);
      }
    };
  }, []);

  const formatMoneyline = useMemo(() => {
    return (odds: number) => {
      return odds > 0 ? `+${odds}` : `${odds}`;
    };
  }, []);

  const getSpreadDisplay = useMemo(() => {
    return (spread: number) => {
      return spread > 0 ? `+${spread}` : `${spread}`;
    };
  }, []);

  const calculatePayout = useMemo(() => {
    return (odds: number, wager: number) => {
      if (odds > 0) {
        return (odds / 100) * wager;
      } else {
        return (100 / Math.abs(odds)) * wager;
      }
    };
  }, []);

  const getOddsColor = useMemo(() => {
    return (odds: number) => {
      return odds < 0 ? 'text-green-600' : 'text-red-600';
    };
  }, []);

  const formatPercentage = useMemo(() => {
    return (probability: number, decimals: number = 1) => {
      return `${(probability * 100).toFixed(decimals)}%`;
    };
  }, []);

  return {
    calculateImpliedProbability,
    formatMoneyline,
    getSpreadDisplay,
    calculatePayout,
    getOddsColor,
    formatPercentage,
  };
};
