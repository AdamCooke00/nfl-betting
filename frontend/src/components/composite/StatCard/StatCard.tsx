import { Card, Stack, Text } from '../../ui';
import type { StatCardProps } from './StatCard.types';

const StatCard = ({
  label,
  value,
  variant = 'primary',
  size = 'md',
}: StatCardProps) => {
  const colorMap = {
    primary: 'primary',
    secondary: 'secondary',
    success: 'success',
    warning: 'warning',
    error: 'error',
  } as const;

  const textSizes = {
    sm: { label: 'xs' as const, value: 'sm' as const },
    md: { label: 'sm' as const, value: 'base' as const },
    lg: { label: 'base' as const, value: 'lg' as const },
  };

  return (
    <Card padding="sm" className="text-center">
      <Stack direction="column" gap="xs" align="center">
        <Text size={textSizes[size].label} color="secondary" weight="medium">
          {label}
        </Text>
        <Text
          size={textSizes[size].value}
          color={colorMap[variant]}
          weight="semibold"
        >
          {value}
        </Text>
      </Stack>
    </Card>
  );
};

export default StatCard;
