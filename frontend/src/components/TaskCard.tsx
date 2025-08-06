import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  TextField,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  ThumbUp,
  ThumbDown,
} from '@mui/icons-material';
import { Task } from '../types';
import { tasksAPI } from '../services/api';

interface TaskCardProps {
  task: Task;
  onTaskUpdate: (updatedTask: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onTaskUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editedSummary, setEditedSummary] = useState(task?.summary || '');
  const [isEditingSummary, setIsEditingSummary] = useState(false);

  if (!task) return null;

  const handleApprove = async () => {
    setLoading(true);
    setError(''); // Clear any previous errors
    try {
      console.log(' TaskCard: Approving task', task.id);
      const updatedTask = await tasksAPI.approveTask(task);
      console.log('TaskCard: Received updated task', updatedTask);
      onTaskUpdate(updatedTask);
    } catch (err: any) {
      console.error('TaskCard: Error approving task', err);
      setError('Failed to approve task');
    } finally {
      setLoading(false);
    }
  };

  const handleDisapprove = async () => {
    setLoading(true);
    setError(''); // Clear any previous errors
    try {
      console.log(' TaskCard: Disapproving task', task.id);
      const updatedTask = await tasksAPI.disapproveTask(task);
      console.log('TaskCard: Received updated task', updatedTask);
      onTaskUpdate(updatedTask);
    } catch (err: any) {
      console.error('TaskCard: Error disapproving task', err);
      setError('Failed to disapprove task');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSummary = async () => {
    setLoading(true);
    try {
      const updatedTask = await tasksAPI.updateSummary(task.id, editedSummary);
      onTaskUpdate(updatedTask);
      setIsEditingSummary(false);
    } catch (err) {
      setError('Failed to update summary');
    } finally {
      setLoading(false);
    }
  };

  // Access fields directly from task since API structure is flat
  const approved = task?.approved;
  const summary = task?.summary || '';
  const longText = task?.long_text || '';
  const createdAt = task?.createdAt || '';

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
          <Typography variant="h6">Task #{task.id}</Typography>
          {approved === true && <Chip label="Approved" color="success" />}
          {approved === false && <Chip label="Disapproved" color="error" />}
          {approved !== true && approved !== false && <Chip label="Pending" />}
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
                <Button size="small" variant="contained" onClick={handleSaveSummary} disabled={loading}>
                  Save
                </Button>
                <Button size="small" variant="outlined" onClick={() => setIsEditingSummary(false)} disabled={loading}>
                  Cancel
                </Button>
              </Box>
            </Box>
          ) : (
            <Box display="flex" alignItems="start" gap={1}>
              <Typography variant="body2" sx={{ flexGrow: 1 }}>
                {summary || 'No summary available'}
              </Typography>
              <Button size="small" onClick={() => setIsEditingSummary(true)}>
                Edit
              </Button>
            </Box>
          )}
        </Box>

        <Box mb={2}>
          <Typography variant="subtitle2" color="text.secondary">Full Text:</Typography>
          <Typography variant="body2">{longText}</Typography>
        </Box>

        <Box display="flex" gap={1} justifyContent="flex-end">
          <Button
            variant="contained"
            color="success"
            startIcon={loading ? <CircularProgress size={16} /> : <ThumbUp />}
            onClick={handleApprove}
            disabled={loading || approved === true}
            size="small"
          >
            Approve
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={loading ? <CircularProgress size={16} /> : <ThumbDown />}
            onClick={handleDisapprove}
            disabled={loading || approved === false}
            size="small"
          >
            Disapprove
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