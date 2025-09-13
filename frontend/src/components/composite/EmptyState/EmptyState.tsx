import { Stack, Text, Button } from '../../ui';
import type { EmptyStateProps } from './EmptyState.types';

const EmptyState = ({ message, description, action }: EmptyStateProps) => {
  return (
    <Stack
      direction="column"
      align="center"
      justify="center"
      gap="sm"
      className="py-16 text-center"
    >
      <Text size="lg" color="secondary" weight="medium">
        {message}
      </Text>
      {description && (
        <Text color="secondary" className="max-w-md">
          {description}
        </Text>
      )}
      {action && (
        <Button variant="secondary" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </Stack>
  );
};

export default EmptyState;
