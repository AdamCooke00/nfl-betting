import { useState } from 'react';
import { Dashboard } from './components';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import Navigation from './components/Navigation';
import { Container } from './components/ui';

function App() {
  const [activeView, setActiveView] = useState<'dashboard' | 'analytics'>(
    'dashboard'
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Container className="py-8">
        <Navigation activeView={activeView} onViewChange={setActiveView} />
        {activeView === 'dashboard' ? <Dashboard /> : <AnalyticsDashboard />}
      </Container>
    </div>
  );
}

export default App;
