import { useState, useEffect, useCallback } from 'react';
import { Task } from '../types';
import { tasksAPI } from '../services/api';

type TaskStatus = 'all' | 'approved' | 'disapproved' | 'pending';

interface UseTasksReturn {
  tasks: Task[];
  filteredTasks: Task[];
  loading: boolean;
  error: string | null;
  statusFilter: TaskStatus;
  stats: {
    total: number;
    approved: number;
    disapproved: number;
    pending: number;
  };
  loadTasks: () => Promise<void>;
  updateTask: (updatedTask: Task) => void;
  setStatusFilter: (filter: TaskStatus) => void;
  clearError: () => void;
}

export const useTasks = (): UseTasksReturn => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<TaskStatus>('all');

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await tasksAPI.getUserTasks();
      setTasks(response.data);
    } catch (err: unknown) {
      console.error('Error loading tasks:', err);
      setError('Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTask = useCallback((updatedTask: Task) => {
    setTasks(prevTasks => 
      prevTasks.map(task => {
        const isMatch = 
          (task.documentId && updatedTask.documentId && task.documentId === updatedTask.documentId) ||
          (task.id === updatedTask.id);
        
        return isMatch ? updatedTask : task;
      })
    );
  }, []);

  // Calculate stats
  const stats = {
    total: tasks.length,
    approved: tasks.filter(task => task.approved === true).length,
    disapproved: tasks.filter(task => task.approved === false).length,
    pending: tasks.filter(task => task.approved === undefined || task.approved === null).length,
  };

  // Filter tasks based on status
  const filteredTasks = tasks.filter(task => {
    switch (statusFilter) {
      case 'approved':
        return task.approved === true;
      case 'disapproved':
        return task.approved === false;
      case 'pending':
        return task.approved === undefined || task.approved === null;
      default:
        return true;
    }
  });

  // Load tasks on mount
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  return {
    tasks,
    filteredTasks,
    loading,
    error,
    statusFilter,
    stats,
    loadTasks,
    updateTask,
    setStatusFilter,
    clearError,
  };
};