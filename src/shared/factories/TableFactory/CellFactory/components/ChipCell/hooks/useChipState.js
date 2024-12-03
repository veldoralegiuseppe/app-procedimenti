import { useState, useMemo, useCallback } from 'react';

const useChipState = ({ value, status: initialStatus, nextStateFn }) => {
  const [label, setLabel] = useState(value);
  const [status, setStatus] = useState(initialStatus || 'red');
  const [message, setMessage] = useState('');

  const statusFlagOptions = useMemo(
    () => ({
      red: { color: '#ffcccb', textColor: '#b71c1c' },
      yellow: { color: '#fff3cd', textColor: '#856404' },
      green: { color: '#c8e6c9', textColor: '#2e7d32' },
    }),
    []
  );

  const chipStyles = useMemo(
    () => ({
      backgroundColor: statusFlagOptions[status]?.color,
      color: statusFlagOptions[status]?.textColor,
      cursor: 'pointer',
      fontWeight: 'bold',
      '&:hover': {
        backgroundColor: statusFlagOptions[status]?.color,
      },
    }),
    [status, statusFlagOptions]
  );

  const handleNextState = useCallback(() => {
    const { label: newLabel, status: newStatus, message: newMessage } = nextStateFn(label);
    setLabel(newLabel);
    setStatus(newStatus);
    setMessage(newMessage);
    console.log('newMessage', newMessage);
    return { label: newLabel, status: newStatus, message: newMessage };
  }, [label, nextStateFn]);

  return { label, status, message, chipStyles, handleNextState };
};

export default useChipState;
