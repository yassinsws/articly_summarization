import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { User } from './types';
import { authAPI } from './services/api';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in on app start
  useEffect(() => {
    const checkAuthStatus = () => {
      if (authAPI.isAuthenticated()) {
        const storedUser = authAPI.getCurrentUser();
        if (storedUser) {
          setUser(storedUser);
        }
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  // Show loading while checking auth status
  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        Loading...
      </Box>
    );
  }

  // Show dashboard if user is logged in, otherwise show login
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {user ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </Box>
  );
};

export default App;