import { Dashboard } from './components';
import { Container } from './components/ui';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Container className="py-8">
        <Dashboard />
      </Container>
    </div>
  );
}

export default App;
