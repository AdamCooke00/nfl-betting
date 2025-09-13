import { forwardRef } from 'react';
import { cn, typography, effects } from '../../../theme';
import type { BadgeProps } from './Badge.types';

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    { variant = 'neutral', size = 'md', children, className, ...props },
    ref
  ) => {
    const variantStyles = {
      primary: 'bg-blue-100 text-blue-800',
      secondary: 'bg-gray-100 text-gray-800',
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800',
      neutral: 'bg-gray-100 text-gray-800',
    };

    const sizeStyles = {
      sm: cn('px-2 py-1', typography.text.xs),
      md: cn('px-2.5 py-1', typography.text.sm),
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center',
          effects.rounded.base,
          typography.weight.medium,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;
