import { useState, useCallback, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  TextField,
  CircularProgress,
} from '@mui/material';
import {
  ThumbUp,
  ThumbDown,
  Edit,
  Save,
  Cancel,
} from '@mui/icons-material';
import { Task } from '../types';
import { tasksAPI } from '../services/api';
import StatusChip from './common/StatusChip';
import ErrorAlert from './common/ErrorAlert';

interface TaskCardProps {
  task: Task;
  onTaskUpdate: (updatedTask: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onTaskUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editedSummary, setEditedSummary] = useState(task?.summary || '');
  useEffect(() => {
    setEditedSummary(task?.summary || '');
  }, [task?.summary]);
  const [isEditingSummary, setIsEditingSummary] = useState(false);

  const clearError = useCallback(() => setError(''), []);

  const handleApprove = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const updatedTask = await tasksAPI.approveTask(task);
      onTaskUpdate(updatedTask);
    } catch (err: unknown) {
      console.error('Error approving task:', err);
      setError('Failed to approve task. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [task, onTaskUpdate]);

  const handleDisapprove = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const updatedTask = await tasksAPI.disapproveTask(task);
      onTaskUpdate(updatedTask);
    } catch (err: unknown) {
      console.error('Error disapproving task:', err);
      setError('Failed to disapprove task. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [task, onTaskUpdate]);

  const handleSaveSummary = useCallback(async () => {
    if (editedSummary.trim() === '') {
      setError('Summary cannot be empty');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const updatedTask = await tasksAPI.updateSummary(task, editedSummary.trim());
      onTaskUpdate(updatedTask);
      setIsEditingSummary(false);
    } catch (err: unknown) {
      console.error('Error updating summary:', err);
      setError('Failed to update summary. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [task, editedSummary, onTaskUpdate]);

  const handleCancelEdit = useCallback(() => {
    setEditedSummary(task?.summary || '');
    setIsEditingSummary(false);
    setError('');
  }, [task?.summary]);

  if (!task) return null;

  // Access fields directly from task since API structure is flat
  const approved = task?.approved;
  const summary = task?.summary || '';
  const longText = task?.long_text || '';
  const createdAt = task?.createdAt || '';

  return (
    <Card sx={{ mb: 2, '&:hover': { boxShadow: 2 } }}>
      <CardContent>
        {error && (
          <ErrorAlert 
            message={error}
            onDismiss={clearError}
          />
        )}

        <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
          <Typography variant="h6">Task #{task.id}</Typography>
          <StatusChip approved={approved} />
        </Box>

        <Box mb={2}>
          <Typography variant="subtitle2" color="text.secondary">Summary:</Typography>
          {isEditingSummary ? (
            <Box>
              <TextField
                fullWidth
                multiline
                rows={3}
                value={editedSummary}
                onChange={(e) => setEditedSummary(e.target.value)}
                disabled={loading}
              />
              <Box mt={1} display="flex" gap={1}>
                <Button 
                  size="small" 
                  variant="contained" 
                  startIcon={loading ? <CircularProgress size={16} /> : <Save />}
                  onClick={handleSaveSummary} 
                  disabled={loading || editedSummary.trim() === ''}
                >
                  Save
                </Button>
                <Button 
                  size="small" 
                  variant="outlined" 
                  startIcon={<Cancel />}
                  onClick={handleCancelEdit} 
                  disabled={loading}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          ) : (
            <Box display="flex" alignItems="start" gap={1}>
              <Typography variant="body2" sx={{ flexGrow: 1 }}>
                {summary || 'No summary available'}
              </Typography>
              <Button 
                size="small" 
                startIcon={<Edit />}
                onClick={() => setIsEditingSummary(true)}
              >
                Edit
              </Button>
            </Box>
          )}
        </Box>

        <Box mb={2}>
          <Typography variant="subtitle2" color="text.secondary">Full Text:</Typography>
          <Typography variant="body2">{longText}</Typography>
        </Box>

        <Box display="flex" gap={1} justifyContent="flex-end" alignItems="center">
          <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
            Status:
          </Typography>
          <Button
            variant={approved === true ? "contained" : "outlined"}
            color="success"
            startIcon={loading ? <CircularProgress size={16} /> : <ThumbUp />}
            onClick={handleApprove}
            disabled={loading}
            size="small"
            sx={{ 
              opacity: approved === false ? 0.7 : 1,
              fontWeight: approved === true ? 'bold' : 'normal'
            }}
          >
            {approved === true ? "Approved ✓" : "Approve"}
          </Button>
          <Button
            variant={approved === false ? "contained" : "outlined"}
            color="error"
            startIcon={loading ? <CircularProgress size={16} /> : <ThumbDown />}
            onClick={handleDisapprove}
            disabled={loading}
            size="small"
            sx={{ 
              opacity: approved === true ? 0.7 : 1,
              fontWeight: approved === false ? 'bold' : 'normal'
            }}
          >
            {approved === false ? "Disapproved ✗" : "Disapprove"}
          </Button>
        </Box>

        {createdAt && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
            Created: {new Date(createdAt).toLocaleDateString()}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskCard;