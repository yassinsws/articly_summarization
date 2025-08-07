// React import removed for React 19 compatibility
import { Box } from '@mui/material';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import LoadingSpinner from './components/common/LoadingSpinner';
import { useAuth } from './hooks/useAuth';

const App: React.FC = () => {
  const { user, isLoading, login, logout } = useAuth();

  // Show loading while checking auth status
  if (isLoading) {
    return <LoadingSpinner message="Initializing..." fullScreen />;
  }

  // Show dashboard if user is logged in, otherwise show login
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {user ? (
        <Dashboard user={user} onLogout={logout} />
      ) : (
        <Login onLogin={login} />
      )}
    </Box>
  );
};

export default App;