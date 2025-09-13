import { forwardRef } from 'react';
import { cn, spacing } from '../../../theme';
import type { StackProps } from './Stack.types';

const Stack = forwardRef<HTMLDivElement, StackProps>(
  (
    {
      direction = 'column',
      gap = 'md',
      align = 'stretch',
      justify = 'start',
      wrap = false,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const directionStyles = {
      row: 'flex-row',
      column: 'flex-col',
    };

    const alignStyles = {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
    };

    const justifyStyles = {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex',
          directionStyles[direction],
          spacing.gap[gap],
          alignStyles[align],
          justifyStyles[justify],
          wrap && 'flex-wrap',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Stack.displayName = 'Stack';

export default Stack;
