
import { useAuth } from '@/hooks/useAuth';
import { LoginScreen } from '@/components/LoginScreen';
import { Dashboard } from '@/components/Dashboard';

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {user ? <Dashboard /> : <LoginScreen />}
    </div>
  );
};

export default Index;
