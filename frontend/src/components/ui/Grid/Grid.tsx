import { forwardRef } from 'react';
import { cn, spacing } from '../../../theme';
import type { GridProps } from './Grid.types';

const Grid = forwardRef<HTMLDivElement, GridProps>(
  (
    { cols = 1, gap = 'md', responsive, children, className, ...props },
    ref
  ) => {
    const colsStyles = {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
      5: 'grid-cols-5',
      6: 'grid-cols-6',
      auto: 'grid-cols-auto-fit',
    };

    const responsiveClasses = responsive
      ? [
          responsive.sm && `sm:grid-cols-${responsive.sm}`,
          responsive.md && `md:grid-cols-${responsive.md}`,
          responsive.lg && `lg:grid-cols-${responsive.lg}`,
        ].filter(Boolean)
      : [];

    return (
      <div
        ref={ref}
        className={cn(
          'grid',
          colsStyles[cols],
          spacing.gap[gap],
          ...responsiveClasses,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Grid.displayName = 'Grid';

export default Grid;
