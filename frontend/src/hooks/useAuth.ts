import { useState, useEffect, useCallback } from 'react';
import { User, LoginCredentials } from '../types';
import { authAPI } from '../services/api';
import { config } from '../config/env';

interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  error: string | null;
  clearError: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        if (authAPI.isAuthenticated()) {
          const storedUser = authAPI.getCurrentUser();
          if (storedUser) {
            setUser(storedUser);
          }
        }
      } catch (err: unknown) {
        console.error('Failed to initialize auth:', err);
        // Clear potentially corrupted data
        authAPI.logout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authAPI.login(credentials);
      
      // Store auth data
      localStorage.setItem(config.settings.TOKEN_KEY, response.jwt);
      localStorage.setItem(config.settings.USER_KEY, JSON.stringify(response.user));
      
      setUser(response.user);
    } catch (err: unknown) {
      const errorMessage = 
        err instanceof Error 
          ? err.message 
          : 'Login failed. Please check your credentials.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authAPI.logout();
    setUser(null);
    setError(null);
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    error,
    clearError,
  };
};