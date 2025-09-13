import { forwardRef } from 'react';
import { cn, colors, spacing, effects } from '../../../theme';
import type {
  CardProps,
  CardHeaderProps,
  CardBodyProps,
  CardFooterProps,
} from './Card.types';

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    { variant = 'default', padding = 'md', children, className, ...props },
    ref
  ) => {
    const variantStyles = {
      default: cn(colors.white, effects.shadow.base),
      elevated: cn(colors.white, effects.shadow.lg, effects.hover.glow),
      outline: cn(colors.white, effects.border.thin),
    };

    const paddingStyles = {
      none: '',
      sm: spacing.padding.sm,
      md: spacing.padding.lg,
      lg: spacing.padding.xl,
    };

    return (
      <div
        ref={ref}
        className={cn(
          effects.rounded.lg,
          effects.transition.shadow,
          variantStyles[variant],
          paddingStyles[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ children, className, ...props }, ref) => (
    <div ref={ref} className={cn('mb-4', className)} {...props}>
      {children}
    </div>
  )
);

const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  ({ children, className, ...props }, ref) => (
    <div ref={ref} className={cn('flex-1', className)} {...props}>
      {children}
    </div>
  )
);

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('mt-4 pt-4 border-t border-gray-200', className)}
      {...props}
    >
      {children}
    </div>
  )
);

Card.displayName = 'Card';
CardHeader.displayName = 'CardHeader';
CardBody.displayName = 'CardBody';
CardFooter.displayName = 'CardFooter';

export default Card;
export { CardHeader, CardBody, CardFooter };
