import React from 'react';
import { Alert, AlertTitle, Button } from '@mui/material';
import { Refresh } from '@mui/icons-material';

interface ErrorAlertProps {
  message: string;
  title?: string;
  severity?: 'error' | 'warning' | 'info';
  onRetry?: () => void;
  retryLabel?: string;
  onDismiss?: () => void;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({
  message,
  title,
  severity = 'error',
  onRetry,
  retryLabel = 'Retry',
  onDismiss,
}) => {
  return (
    <Alert 
      severity={severity} 
      onClose={onDismiss}
      sx={{ mb: 2 }}
      action={
        onRetry && (
          <Button
            color="inherit"
            size="small"
            startIcon={<Refresh />}
            onClick={onRetry}
          >
            {retryLabel}
          </Button>
        )
      }
    >
      {title && <AlertTitle>{title}</AlertTitle>}
      {message}
    </Alert>
  );
};

export default ErrorAlert;