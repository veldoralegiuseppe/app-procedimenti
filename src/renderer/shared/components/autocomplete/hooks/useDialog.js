import { useState, useCallback } from 'react';

export const useDialog = () => {
  const [open, setOpen] = useState(false);
  const [dialogValue, setDialogValue] = useState('');

  const openDialog = useCallback(() => setOpen(true), []);
  const closeDialog = useCallback(() => setOpen(false), []);

  return { open, dialogValue, openDialog, closeDialog, setDialogValue };
};
