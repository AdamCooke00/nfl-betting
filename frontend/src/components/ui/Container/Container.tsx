import { forwardRef } from 'react';
import { cn } from '../../../theme';
import type { ContainerProps } from './Container.types';

const Container = forwardRef<HTMLDivElement, ContainerProps>(
  (
    {
      size = 'lg',
      padding = true,
      center = true,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const sizeStyles = {
      sm: 'max-w-screen-sm',
      md: 'max-w-screen-md',
      lg: 'max-w-screen-lg',
      xl: 'max-w-screen-xl',
      full: 'max-w-full',
    };

    return (
      <div
        ref={ref}
        className={cn(
          sizeStyles[size],
          center && 'mx-auto',
          padding && 'px-4',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Container.displayName = 'Container';

export default Container;
