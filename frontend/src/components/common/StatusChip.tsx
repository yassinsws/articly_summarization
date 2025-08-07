import { Chip } from '@mui/material';

interface StatusChipProps {
  approved?: boolean | null;
}

const StatusChip: React.FC<StatusChipProps> = ({ approved }) => {
  if (approved === true) {
    return (
      <Chip 
        label="Approved" 
        color="success" 
        variant="filled" 
        size="small"
      />
    );
  }
  
  if (approved === false) {
    return (
      <Chip 
        label="Disapproved" 
        color="error" 
        variant="filled" 
        size="small"
      />
    );
  }
  
  return (
    <Chip 
      label="Pending Review" 
      color="default" 
      variant="outlined" 
      size="small"
    />
  );
};

export default StatusChip;