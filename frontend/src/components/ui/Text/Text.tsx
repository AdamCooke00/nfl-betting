import { forwardRef, type ElementType } from 'react';
import { cn, typography } from '../../../theme';
import type { TextProps } from './Text.types';

const Text = forwardRef<HTMLElement, TextProps>(
  (
    {
      size = 'base',
      weight = 'normal',
      color = 'neutral',
      align = 'left',
      truncate = false,
      as = 'span',
      children,
      className,
      ...props
    },
    ref
  ) => {
    const Component = as as ElementType;

    const colorStyles = {
      primary: 'text-blue-600',
      secondary: 'text-gray-600',
      success: 'text-green-800',
      warning: 'text-yellow-800',
      error: 'text-red-800',
      neutral: 'text-gray-900',
    };

    const truncateStyles = {
      true: typography.truncate.single,
      false: typography.truncate.none,
      3: typography.truncate.multiline,
    };

    const getTruncateStyle = () => {
      if (typeof truncate === 'boolean') {
        return truncateStyles[truncate.toString() as 'true' | 'false'];
      }
      if (truncate === 3) {
        return truncateStyles[3];
      }
      return typography.truncate.none;
    };

    return (
      <Component
        ref={ref}
        className={cn(
          // Size and weight from theme
          typography.text[size],
          typography.weight[weight],
          typography.align[align],

          // Color
          colorStyles[color],

          // Truncation
          getTruncateStyle(),

          // Custom className
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Text.displayName = 'Text';

export default Text;
