import type { HTMLAttributes } from 'react';

export interface TextProps extends HTMLAttributes<HTMLSpanElement> {
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral';
  align?: 'left' | 'center' | 'right';
  truncate?: boolean | number;
  as?: 'span' | 'p' | 'div';
  children: React.ReactNode;
}
