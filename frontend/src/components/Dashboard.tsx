import React from 'react';
import {
  Container,
  Typography,
  Box,
  AppBar,
  Toolbar,
  Button,
  Paper,
  Chip,
} from '@mui/material';
import { Logout, Refresh } from '@mui/icons-material';
import { User } from '../types';
import { useTasks } from '../hooks/useTasks';
import TaskCard from './TaskCard';
import LoadingSpinner from './common/LoadingSpinner';
import ErrorAlert from './common/ErrorAlert';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const {
    filteredTasks,
    loading,
    error,
    statusFilter,
    stats,
    loadTasks,
    updateTask,
    setStatusFilter,
    clearError,
  } = useTasks();

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
            onClick={onLogout}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        {/* Statistics */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Task Overview - Click to filter
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap">
            <Chip 
              label={`Total: ${stats.total}`} 
              variant={statusFilter === 'all' ? 'filled' : 'outlined'}
              color={statusFilter === 'all' ? 'primary' : 'default'}
              onClick={() => setStatusFilter('all')}
              clickable
            />
            <Chip 
              label={`Approved: ${stats.approved}`} 
              variant={statusFilter === 'approved' ? 'filled' : 'outlined'}
              color="success"
              onClick={() => setStatusFilter('approved')}
              clickable
            />
            <Chip 
              label={`Disapproved: ${stats.disapproved}`} 
              variant={statusFilter === 'disapproved' ? 'filled' : 'outlined'}
              color="error"
              onClick={() => setStatusFilter('disapproved')}
              clickable
            />
            <Chip 
              label={`Pending: ${stats.pending}`} 
              variant={statusFilter === 'pending' ? 'filled' : 'outlined'}
              color="default"
              onClick={() => setStatusFilter('pending')}
              clickable
            />
          </Box>
          {statusFilter !== 'all' && (
            <Box mt={2}>
              <Typography variant="body2" color="text.secondary">
                Showing {statusFilter} tasks ({filteredTasks.length} of {stats.total})
              </Typography>
            </Box>
          )}
        </Paper>

        {error && (
          <ErrorAlert 
            message={error}
            onRetry={loadTasks}
            onDismiss={clearError}
          />
        )}

        {loading ? (
          <LoadingSpinner message="Loading tasks..." />
        ) : stats.total === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No tasks found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              You haven't created any tasks yet.
            </Typography>
          </Paper>
        ) : filteredTasks.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No {statusFilter} tasks found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try selecting a different filter or create new tasks.
            </Typography>
          </Paper>
        ) : (
          <Box>
            <Typography variant="h5" gutterBottom>
              {statusFilter === 'all' ? 'Your Tasks' : `${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Tasks`} ({filteredTasks.length})
            </Typography>
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.documentId || task.id}
                task={task}
                onTaskUpdate={updateTask}
              />
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Dashboard;