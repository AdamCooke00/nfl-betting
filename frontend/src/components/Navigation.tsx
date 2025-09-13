import { Stack, Button } from './ui';

interface NavigationProps {
  activeView: 'dashboard' | 'analytics';
  onViewChange: (view: 'dashboard' | 'analytics') => void;
}

const Navigation = ({ activeView, onViewChange }: NavigationProps) => {
  return (
    <Stack direction="row" gap="sm" className="border-b pb-4 mb-6">
      <Button
        variant={activeView === 'dashboard' ? 'primary' : 'ghost'}
        onClick={() => onViewChange('dashboard')}
      >
        Games Dashboard
      </Button>
      <Button
        variant={activeView === 'analytics' ? 'primary' : 'ghost'}
        onClick={() => onViewChange('analytics')}
      >
        Analytics
      </Button>
    </Stack>
  );
};

export default Navigation;
