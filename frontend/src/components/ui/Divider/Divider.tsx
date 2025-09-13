import { forwardRef } from 'react';
import { cn } from '../../../theme';
import type { DividerProps } from './Divider.types';

const Divider = forwardRef<HTMLDivElement, DividerProps>(
  (
    {
      orientation = 'horizontal',
      variant = 'solid',
      spacing: spacingProp = 'md',
      className,
      ...props
    },
    ref
  ) => {
    const orientationStyles = {
      horizontal: 'w-full h-px',
      vertical: 'h-full w-px',
    };

    const variantStyles = {
      solid: 'border-gray-200',
      dashed: 'border-gray-200 border-dashed',
    };

    const spacingStyles = {
      none: '',
      sm: orientation === 'horizontal' ? 'my-2' : 'mx-2',
      md: orientation === 'horizontal' ? 'my-4' : 'mx-4',
      lg: orientation === 'horizontal' ? 'my-6' : 'mx-6',
    };

    const borderStyle = orientation === 'horizontal' ? 'border-t' : 'border-l';

    return (
      <div
        ref={ref}
        className={cn(
          orientationStyles[orientation],
          borderStyle,
          variantStyles[variant],
          spacingStyles[spacingProp],
          className
        )}
        role="separator"
        {...props}
      />
    );
  }
);

Divider.displayName = 'Divider';

export default Divider;
