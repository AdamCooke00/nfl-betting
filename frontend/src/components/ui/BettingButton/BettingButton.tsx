import { cn, colors } from '../../../theme';
import type { BettingButtonProps } from './BettingButton.types';

const BettingButton = ({
  children,
  onClick,
  variant = 'total',
  className,
}: BettingButtonProps) => {
  const variantStyles = {
    home: cn(getBg(colors.primary[50]), 'text-blue-700', 'hover:bg-blue-100'),
    away: cn(getBg(colors.error[50]), 'text-red-700', 'hover:bg-red-100'),
    total: cn(getBg(colors.neutral[50]), 'text-gray-700', 'hover:bg-gray-100'),
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex-1 px-3 py-2 text-sm rounded transition-colors',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </button>
  );
};

// Helper function to extract background class
const getBg = (colorString: string) => colorString.split(' ')[0];

export default BettingButton;
