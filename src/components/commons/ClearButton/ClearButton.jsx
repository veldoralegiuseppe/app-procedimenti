import React from 'react';
import { ClearButton } from '@theme/MainTheme';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from '@mui/material/styles';
import { useModelChanged } from './hooks/useModelChanged';

function ClearBtn({ onClick, touchedFields, model }) {
  const theme = useTheme();
  const isModified = useModelChanged(touchedFields, model);


  return (
    <ClearButton
      variant="outlined"
      onClick={onClick}
      startIcon={
        <DeleteIcon
          sx={{
            color: !isModified
              ? 'rgb(105 105 105 / 60%)'
              : theme.palette.primary.main,
          }}
        />
      }
      sx={{
        fontSize: '.9rem',
        '&.Mui-disabled': { color: theme.palette.text.disabled },
      }}
      disabled={!isModified}
    >
      Pulisci campi
    </ClearButton>
  );
}

export default ClearBtn;
