// Environment configuration
export const config = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:1337',
  NODE_ENV: import.meta.env.MODE || 'development',
  
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