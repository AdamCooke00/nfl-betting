import { Card, Stack, Text, Button } from '../../ui';
import type { ErrorStateProps } from './ErrorState.types';

const ErrorState = ({
  message,
  onRetry,
  retryText = 'Retry',
}: ErrorStateProps) => {
  return (
    <Card variant="outline" className="border-red-200 bg-red-50">
      <Stack direction="column" gap="sm">
        <Text color="error" weight="medium">
          Error: {message}
        </Text>
        {onRetry && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onRetry}
            className="text-red-600 hover:text-red-800 hover:bg-red-100"
          >
            {retryText}
          </Button>
        )}
      </Stack>
    </Card>
  );
};

export default ErrorState;
