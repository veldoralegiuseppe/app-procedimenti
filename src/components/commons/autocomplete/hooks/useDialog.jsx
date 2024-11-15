import { useState } from 'react';

export const useDialog = () => {
  const [open, setOpen] = useState(false);
  const [dialogValue, setDialogValue] = useState('');

  const openDialog = () => setOpen(true);
  const closeDialog = () => setOpen(false);

  return { open, dialogValue, openDialog, closeDialog, setDialogValue };
};
