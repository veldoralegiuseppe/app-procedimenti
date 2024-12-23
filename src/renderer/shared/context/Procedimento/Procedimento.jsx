import React, { useMemo, useCallback } from 'react';
import { createContext, useState } from 'react';
import 'dayjs/locale/it';
import Backdrop from '@mui/material/Backdrop';
import _ from 'lodash';
import { NotificationAlert } from '@ui-shared/components';

export const ProcedimentoContext = createContext();

const ProcedimentoProvider = ({ children }) => {
  // Stati locali
  const [showAlert, setShowAlert] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('error');
  const [alertMessage, setAlertMessage] = useState(null);
  const [isBackdropOpen, setIsBackdropOpen] = useState(false);

  // Funzione per notifiche
  const notify = useCallback((message, severity) => {
    setShowAlert(true);
    setAlertMessage(message);
    setAlertSeverity(severity);
  }, []);

  // Valori del contesto
  const contextValue = useMemo(
    () => ({
      notify,
      isBackdropOpen,
      setIsBackdropOpen,
    }),
    [notify, isBackdropOpen]
  );

  return (
    <ProcedimentoContext.Provider value={contextValue}>
      {children}

      <NotificationAlert
        isOpen={showAlert}
        message={alertMessage}
        severity={alertSeverity}
        sx={{padding: '1rem'}}
        onClose={() => {
          setShowAlert(false);
          setAlertMessage(null);
        }}
      />
      <Backdrop open={isBackdropOpen} />
    </ProcedimentoContext.Provider>
  );
};

//ProcedimentoProvider.whyDidYouRender = true;

export { ProcedimentoProvider };
