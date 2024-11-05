import * as React from 'react';
import { Alert, Stack } from '@mui/material';

export default function NotificationAlert({
  isOpen,
  message,
  severity = 'info',
  onClose,
}) {
  const handleClose = () => {
    if (onClose) onClose();
  };

  return (
    <Stack
      sx={{
        zIndex: '99',
        position: 'sticky', 
        bottom: '0', 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      spacing={2}
    >
      {isOpen && (
        <Alert
          onClose={handleClose}
          severity={severity}
          sx={{
            width: '60%',
            borderRadius: '8px',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            '& .MuiAlert-message': {
              color: severity === 'error' ? '#d32f2f' : undefined,
              fontSize: '1rem',
              display: 'flex',
              justifyItems: 'center',
              alignItems: 'center',
              whiteSpace: 'pre-line',
            },
            '& .MuiAlert-icon': {
            },
          }}
        >
          {message}
        </Alert>
      )}
    </Stack>
  );
}
