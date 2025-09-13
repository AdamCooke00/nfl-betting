import { forwardRef } from 'react';
import { cn, colors, layout, effects, typography } from '../../../theme';
import type { ButtonProps } from './Button.types';

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      disabled,
      children,
      className,
      ...props
    },
    ref
  ) => {
    // Variant styles using our theme system
    const variantStyles = {
      primary: cn(
        colors.primary[500],
        'text-white',
        'hover:bg-blue-600 hover:transform hover:-translate-y-0.5 hover:shadow-lg',
        'focus:bg-blue-700',
        'transition-all duration-200 ease-out'
      ),
      secondary: cn(
        colors.neutral[100],
        'text-gray-900',
        'hover:bg-gray-200 hover:transform hover:-translate-y-0.5 hover:shadow-md',
        'focus:bg-gray-300',
        'border border-gray-300',
        'transition-all duration-200 ease-out'
      ),
      ghost: cn(
        'bg-transparent',
        'text-gray-700',
        'hover:bg-gray-100 hover:transform hover:-translate-y-0.5',
        'focus:bg-gray-100',
        'transition-all duration-200 ease-out'
      ),
      danger: cn(
        colors.error[600],
        'text-white',
        'hover:bg-red-700 hover:transform hover:-translate-y-0.5 hover:shadow-lg',
        'focus:bg-red-800',
        'transition-all duration-200 ease-out'
      ),
    };

    // Size styles
    const sizeStyles = {
      sm: cn('px-3 py-1.5', typography.text.sm),
      md: cn(layout.button, typography.text.base),
      lg: cn('px-6 py-3', typography.text.lg),
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center cursor-pointer',
          effects.rounded.base,
          typography.weight.medium,
          effects.transition.colors,
          effects.focus.ring,
          'disabled:opacity-50 disabled:cursor-not-allowed',

          // Variant and size
          variantStyles[variant],
          sizeStyles[size],

          // Full width modifier
          fullWidth && 'w-full',

          // Custom className
          className
        )}
        {...props}
      >
        {loading && (
          <svg
            className="w-4 h-4 mr-2 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
