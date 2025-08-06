import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  AppBar,
  Toolbar,
  Button,
  Alert,
  CircularProgress,
  Paper,
  Chip,
} from '@mui/material';
import { Logout, Refresh } from '@mui/icons-material';
import { Task, User } from '../types';
import { tasksAPI, authAPI } from '../services/api';
import TaskCard from './TaskCard';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const loadTasks = async () => {
    setLoading(true);
    setError('');
          try {
        const response = await tasksAPI.getUserTasks();
        console.log('📊 Dashboard received tasks:', response);
        console.log('📊 Tasks array:', response.data);
        console.log('📊 Number of tasks:', response.data?.length);
        setTasks(response.data);
    } catch (err: any) {
      console.error('Error loading tasks:', err);
      setError('Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleLogout = () => {
    authAPI.logout();
    onLogout();
  };

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === updatedTask.id ? updatedTask : task
      )
    );
  };

  const getTaskStats = () => {
    const approved = tasks.filter(task => task?.approved === true).length;
    const disapproved = tasks.filter(task => task?.approved === false).length;
    const pending = tasks.filter(task => task?.approved === undefined || task?.approved === null).length;
    
    return { approved, disapproved, pending, total: tasks.length };
  };

  const stats = getTaskStats();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Task Manager - Welcome, {user.username}
          </Typography>
          <Button
            color="inherit"
            startIcon={<Refresh />}
            onClick={loadTasks}
            disabled={loading}
            sx={{ mr: 1 }}
          >
            Refresh
          </Button>
          <Button
            color="inherit"
            startIcon={<Logout />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        {/* Statistics */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Task Overview
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap">
            <Chip label={`Total: ${stats.total}`} variant="outlined" />
            <Chip label={`Approved: ${stats.approved}`} color="success" />
            <Chip label={`Disapproved: ${stats.disapproved}`} color="error" />
            <Chip label={`Pending: ${stats.pending}`} color="default" />
          </Box>
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" py={4}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Loading tasks...</Typography>
          </Box>
        ) : tasks.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No tasks found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              You haven't created any tasks yet.
            </Typography>
          </Paper>
        ) : (
          <Box>
            <Typography variant="h5" gutterBottom>
              Your Tasks ({tasks.length})
            </Typography>
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onTaskUpdate={handleTaskUpdate}
              />
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Dashboard;