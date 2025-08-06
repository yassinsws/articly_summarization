// Environment configuration
export const config = {
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:1337',
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // API endpoints
  endpoints: {
    AUTH: '/api/auth/local',
    TASKS: '/api/tasks',
  },
  
  // App settings
  settings: {
    TOKEN_KEY: 'auth_token',
    USER_KEY: 'user_data',
    REFRESH_INTERVAL: 30000, // 30 seconds
  },
} as const;

// Validation for required environment variables
const requiredEnvVars = ['REACT_APP_API_URL'];

export const validateEnvironment = (): void => {
  const missing = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );
  
  if (missing.length > 0) {
    console.warn(
      `Missing environment variables: ${missing.join(', ')}`
    );
  }
};