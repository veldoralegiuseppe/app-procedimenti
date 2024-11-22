import { useState } from 'react';

export const useNotification = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('error');
  const [alertMessage, setAlertMessage] = useState(null);

  const notify = (message, severity) => {
    setShowAlert(true);
    setAlertMessage(message);
    setAlertSeverity(severity);
  };

  const closeNotification = () => {
    setShowAlert(false);
    setAlertMessage(null);
  };

  return {
    showAlert,
    alertMessage,
    alertSeverity,
    notify,
    closeNotification,
  };
};
