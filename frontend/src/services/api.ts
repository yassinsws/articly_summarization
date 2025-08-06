import axios from 'axios';
import { AuthResponse, LoginCredentials, TasksResponse, Task } from '../types';
import { config } from '../config/env';

const API_URL = config.API_URL;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (requestConfig) => {
    const token = localStorage.getItem(config.settings.TOKEN_KEY);
    if (token) {
      requestConfig.headers.Authorization = `Bearer ${token}`;
    }
    return requestConfig;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem(config.settings.TOKEN_KEY);
      localStorage.removeItem(config.settings.USER_KEY);
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    console.log('Login request started');

    try {
      console.log('Sending authentication request to Strapi');
      
      // Make sure credentials are sent in the correct format
      const requestData = {
        identifier: credentials.identifier,
        password: credentials.password
      };
      
      const response = await api.post(config.endpoints.AUTH, requestData);
      
      console.log('Login successful');

      return response.data;
    } catch (error: any) {
      console.error('Login failed:', error.response?.status, error.response?.statusText);
      
      // Re-throw the error to be handled by the caller
      throw error;
    }
  },
  
  logout: () => {
          localStorage.removeItem(config.settings.TOKEN_KEY);
      localStorage.removeItem(config.settings.USER_KEY);
  },
  
  getCurrentUser: () => {
          const userData = localStorage.getItem(config.settings.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  },
  
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(config.settings.TOKEN_KEY);
  },
};

// Tasks API
export const tasksAPI = {
  getUserTasks: async (): Promise<TasksResponse> => {
    console.log('Fetching user tasks');
    
    try {
      // Fetch both published and draft tasks using the status parameter
      const response = await api.get(`${config.endpoints.TASKS}?populate=*&status=draft,published`);
      
      console.log('Tasks fetched successfully. Count:', response.data?.data?.length || 0);
      
      return response.data;
    } catch (error: any) {
      console.error('Error fetching tasks:', error.response?.status, error.response?.statusText);
      
      throw error;
    }
  },
  
  updateTask: async (task: Task, data: Partial<Omit<Task, 'id' | 'documentId'>>): Promise<Task> => {
    const taskId = task.documentId || task.id;
    console.log('Updating task:', taskId);
    try {
      const response = await api.put(`${config.endpoints.TASKS}/${taskId}`, { data });
      console.log('Task updated successfully');
      return response.data.data || response.data;
    } catch (error: any) {
      console.error('Error updating task:', error.response?.status, error.response?.statusText);
      throw error;
    }
  },
  
  approveTask: async (task: Task): Promise<Task> => {
    const taskId = task.documentId || task.id;
    console.log('Approving task:', taskId);
    try {
      const response = await api.put(`${config.endpoints.TASKS}/${taskId}`, {
        data: { approved: true }
      });
      console.log('Task approved successfully');
      // Return the data directly since Strapi v5 returns the updated document
      return response.data.data || response.data;
    } catch (error: any) {
      console.error('Error approving task:', error.response?.status, error.response?.statusText);
      throw error;
    }
  },
  
  disapproveTask: async (task: Task): Promise<Task> => {
    const taskId = task.documentId || task.id;
    console.log('Disapproving task:', taskId);
    try {
      const response = await api.put(`${config.endpoints.TASKS}/${taskId}`, {
        data: { approved: false }
      });
      console.log('Task disapproved successfully');
      // Return the data directly since Strapi v5 returns the updated document
      return response.data.data || response.data;
    } catch (error: any) {
      console.error('Error disapproving task:', error.response?.status, error.response?.statusText);
      throw error;
    }
  },
  
  updateSummary: async (task: Task, summary: string): Promise<Task> => {
    const taskId = task.documentId || task.id;
    console.log('Updating summary for task:', taskId);
    try {
      const response = await api.put(`${config.endpoints.TASKS}/${taskId}`, {
        data: { summary }
      });
      console.log('Summary updated successfully');
      return response.data.data || response.data;
    } catch (error: any) {
      console.error('Error updating summary:', error.response?.status, error.response?.statusText);
      throw error;
    }
  },
};