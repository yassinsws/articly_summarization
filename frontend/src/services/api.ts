import axios from 'axios';
import { AuthResponse, LoginCredentials, TasksResponse, Task } from '../types';

const API_URL = 'http://localhost:1337';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    console.log('🔐 Login Request Started:', {
      url: `${API_URL}/api/auth/local`,
      credentials: {
        ...credentials,
      }
    });

    try {
      console.log('📡 Sending request to Strapi...', {
        method: 'POST',
        url: '/api/auth/local',
        headers: api.defaults.headers,
        data: credentials
      });
      
      // Make sure credentials are sent in the correct format
      const requestData = {
        identifier: credentials.identifier,
        password: credentials.password
      };
      
      const response = await api.post('/api/auth/local', requestData);
      
      console.log('✅ Login Success:', {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        user: {
          ...response.data.user,
          // Only log essential user info
          email: response.data.user?.email,
          username: response.data.user?.username,
          id: response.data.user?.id
        },
        jwt: response.data.jwt ? `${response.data.jwt.substring(0, 10)}...[REDACTED]` : null
      });

      return response.data;
    } catch (error: any) {
      console.error('❌ Login Error:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        error: error.response?.data?.error,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data, // Log the actual data sent
          headers: {
            ...error.config?.headers,
            Authorization: error.config?.headers?.Authorization ? '[REDACTED]' : undefined
          }
        }
      });
      
      // Log the full error object in case we need more details
      console.error('Full error object:', error);
      
      // Re-throw the error to be handled by the caller
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  getCurrentUser: () => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  },
  
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },
};

// Tasks API
export const tasksAPI = {
  getUserTasks: async (): Promise<TasksResponse> => {
    console.log('📋 Fetching user tasks...');
    
    try {
      // Fetch both published and draft tasks using the status parameter
      const response = await api.get('/api/tasks?populate=*&status=draft,published');
      
      console.log('✅ Tasks fetched successfully:', {
        status: response.status,
        tasksCount: response.data?.data?.length || 0,
        publicationState: 'both draft and published'
      });
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Error fetching tasks:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        error: error.response?.data?.error
      });
      
      throw error;
    }
  },
  
  updateTask: async (id: number, data: Partial<Omit<Task, 'id' | 'documentId'>>): Promise<Task> => {
    const response = await api.put(`/api/tasks/${id}`, { data });
    return response.data;
  },
  
  approveTask: async (task: Task): Promise<Task> => {
    const taskId = task.documentId || task.id;
    console.log('🟢 Approving task:', taskId, 'Full task:', task);
    try {
      const response = await api.put(`/api/tasks/${taskId}`, {
        data: { approved: true }
      });
      console.log('✅ Task approved successfully:', response.data);
      // Return the data directly since Strapi v5 returns the updated document
      return response.data.data || response.data;
    } catch (error: any) {
      console.error('❌ Error approving task:', {
        taskId,
        url: `/api/tasks/${taskId}`,
        error: error.response?.data || error.message,
        status: error.response?.status
      });
      throw error;
    }
  },
  
  disapproveTask: async (task: Task): Promise<Task> => {
    const taskId = task.documentId || task.id;
    console.log('🔴 Disapproving task:', taskId, 'Full task:', task);
    try {
      const response = await api.put(`/api/tasks/${taskId}`, {
        data: { approved: false }
      });
      console.log('✅ Task disapproved successfully:', response.data);
      // Return the data directly since Strapi v5 returns the updated document
      return response.data.data || response.data;
    } catch (error: any) {
      console.error('❌ Error disapproving task:', {
        taskId,
        url: `/api/tasks/${taskId}`,
        error: error.response?.data || error.message,
        status: error.response?.status
      });
      throw error;
    }
  },
  
  updateSummary: async (id: number, summary: string): Promise<Task> => {
    const response = await api.put(`/api/tasks/${id}`, {
      data: { summary }
    });
    return response.data;
  },
};