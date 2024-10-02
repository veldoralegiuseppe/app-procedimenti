import React from 'react';
import { FormControl, InputLabel, MenuItem, FormHelperText } from '@mui/material';
import { CssSelect, formControlStyles, labelColor as defaultLabelColor } from '@theme/MainTheme';
import { useTheme } from '@mui/material/styles';

function Select({ 
  label, 
  value, 
  onChange, 
  options = [], 
  error = false, 
  helperText = '', 
  minWidth = '30rem', 
  maxWidth = '168px', 
  labelColor = defaultLabelColor 
}) {
  const theme = useTheme();

  // Definisci lo stile specifico da riutilizzare nel FormControl
  const sxStyles = {
    ...formControlStyles(theme, labelColor),
    maxWidth,
    minWidth,
    margin: '18px 20px 0px 0px', // Imposta il margin predefinito o accetta margini dinamici se necessario
    '&:hover .MuiInputLabel-root:not(.Mui-disabled), &:hover .MuiSvgIcon-root, &:hover .MuiOutlinedInput-root fieldset': {
      color: theme.palette.logo.secondary, // Sincronizza colore su hover
      borderColor: theme.palette.logo.secondary, // Sincronizza il colore del bordo
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: theme.palette.logo.secondary, // Colore della label in focus
    },
    '& .MuiOutlinedInput-root.Mui-focused fieldset': {
      borderColor: theme.palette.logo.secondary, // Colore del bordo in focus
    },
    '& .MuiSvgIcon-root': {
      fill: labelColor, // Colore dell'icona di default
    },
    '& .MuiOutlinedInput-root:hover .MuiSvgIcon-root, & .MuiOutlinedInput-root.Mui-focused .MuiSvgIcon-root': {
      fill: theme.palette.logo.secondary, // Colore dell'icona su hover e focus
    },
  };

  return (
    <FormControl 
      required 
      size='small' 
      sx={sxStyles}
      error={error}
    >
      <InputLabel 
        id={`${label}-input-label`} 
        error={error} 
        sx={{ color: labelColor }}
      >
        {label}
      </InputLabel>

      <CssSelect
        labelId={`${label}-input-label`}
        value={value}
        label={label}
        size='small'
        onChange={onChange}
        MenuProps={{
          PaperProps: {
            sx: {
              bgcolor: theme.palette.dropdown.primary, // Sfondo delle opzioni
              maxHeight: options.length > 5 ? '200px' : 'auto', // Limita l'altezza per scroll quando ci sono più di 5 opzioni
            },
          },
          MenuListProps: {
            sx: {
              '& .MuiMenuItem-root': {
                color: theme.palette.primary.main, // Colore del testo delle opzioni
                bgcolor: theme.palette.dropdown.primary, // Sfondo predefinito delle opzioni
                '&:hover': {
                  bgcolor: theme.palette.dropdown.hover, // Sfondo su hover
                  color: theme.palette.primary.main, // Colore del testo su hover
                },
                '&.Mui-selected': {
                  bgcolor: theme.palette.dropdown.hover, // Sfondo quando un'opzione è selezionata
                  color: theme.palette.primary.main, // Colore del testo selezionato
                },
                '&.Mui-selected:hover': {
                  bgcolor: theme.palette.dropdown.hover, // Sfondo mantenuto su hover quando selezionato
                  color: theme.palette.primary.main, // Colore del testo su hover quando selezionato
                },
              },
            },
          },
        }}
        sx={{ '& .MuiOutlinedInput-input': { fontWeight: '500', color: theme.palette.text.primary } }}
      >
        {options.map((option, index) => (
          <MenuItem key={`${label}-item-${index}`} value={option.value}>
            {option.view}
          </MenuItem>
        ))}
      </CssSelect>

      <FormHelperText error={error}>
        {helperText}
      </FormHelperText>
    </FormControl>
  );
}

export default Select;
