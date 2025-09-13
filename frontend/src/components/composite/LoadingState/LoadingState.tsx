import { Stack, Text } from '../../ui';
import type { LoadingStateProps } from './LoadingState.types';

const LoadingState = ({
  message = 'Loading...',
  size = 'md',
}: LoadingStateProps) => {
  const sizeStyles = {
    sm: 'min-h-32',
    md: 'min-h-64',
    lg: 'min-h-96',
  };

  const spinnerSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <Stack
      direction="column"
      align="center"
      justify="center"
      className={sizeStyles[size]}
    >
      <svg
        className={`${spinnerSizes[size]} animate-spin text-blue-500`}
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
      <Text size="lg" color="secondary">
        {message}
      </Text>
    </Stack>
  );
};

export default LoadingState;
