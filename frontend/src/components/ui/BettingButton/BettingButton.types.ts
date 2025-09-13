import type { ReactNode } from 'react';

export interface BettingButtonProps {
  children: ReactNode;
  onClick: () => void;
  variant?: 'home' | 'away' | 'total';
  className?: string;
}
