import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import NotificationAlert from '@components/NotificationAlert';

export default function FormModal({ open, handleClose, title = "", children}) {
  const theme = useTheme();
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertSeverity, setAlertSeverity] = React.useState('error');
  const [alertMessage, setAlertMessage] = React.useState(null);

  const onFormError = (message) => {
    setShowAlert(true);
    setAlertMessage(message);
    setAlertSeverity('error');
  };

  // Mantieni lo stesso stile del codice originario
  const style = {
    position: 'absolute',
    overflowY: 'scroll',
    minHeight: '600px',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '88vw',
    height: '90vh',
    bgcolor: theme.palette.background.default,
    border: 'unset',
    boxShadow: 24,
    padding: '32px',
  };

  return (
    <Modal keepMounted open={open} onClose={handleClose}>
      <Box sx={style}>
        <div
          style={{
            backgroundColor: '#ed9747', // Stile originario per la barra superiore
            height: '50px',
            marginLeft: '-32px',
            marginRight: '-32px',
            marginTop: '-32px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="h5"
            component="h2" 
            sx={{ color: 'white', marginLeft: '32px' }}
          >
            {title}
          </Typography>
        </div>

        {/* Form */}
        {React.Children.map(children, (child) => React.cloneElement(child, {onError: onFormError, handleClose: handleClose}))}

        {/* Alert */}
        <NotificationAlert
          isOpen={showAlert}
          message={alertMessage}
          severity={alertSeverity}
          onClose={() => {
            setShowAlert(false);
            setAlertMessage(null);
          }}
        />
      </Box>
    </Modal>
  );
}
