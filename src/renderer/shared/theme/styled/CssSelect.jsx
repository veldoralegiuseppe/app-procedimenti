import { styled } from '@mui/system';
import { Select } from '@mui/material';
import { labelColor } from '@ui-shared/theme';

export const CssSelect = styled(Select)(({ theme }) => ({
  '& .MuiInputLabel-root:not(.Mui-error, .Mui-disabled, .Mui-focused)': {
    color: labelColor, // Colore di default della label
  },
  // Stile per lo stato disabilitato del componente
  '&.Mui-disabled': {
    backgroundColor: '#efefef73 !important', // Colore di sfondo per lo stato disabilitato
  },
  '&.Mui-disabled .MuiOutlinedInput-notchedOutline': {
    borderColor: '#eaeaea !important', // Colore del bordo per lo stato disabilitato
  },
  '&.Mui-disabled .MuiSvgIcon-root': {
    fill: labelColor + ' !important', // Mantieni il colore di default dell'icona quando il componente è disabilitato
  },
  '& .MuiSvgIcon-root': {
    fill: labelColor, // Colore di default dell'icona
    transition: 'fill 0.3s ease', // Transizione smooth per il colore dell'icona
  },
  '&:hover:not(.Mui-disabled) .MuiSvgIcon-root:not(.Mui-error, .Mui-disabled)':
    {
      fill: theme.palette.logo.secondary, // Cambia il colore della freccia su hover solo se non è disabilitata e non in errore
    },
  '& .MuiOutlinedInput-root': {
    '&:hover fieldset:not(.Mui-error):not(.Mui-disabled)': {
      borderColor: theme.palette.logo.secondary, // Colore del bordo su hover se non c'è errore e non è disabilitato
    },
    '&.Mui-focused fieldset:not(.Mui-error):not(.Mui-disabled)': {
      borderColor: theme.palette.logo.secondary, // Colore del bordo quando in focus se non c'è errore e non è disabilitato
    },
    '&.Mui-disabled fieldset': {
      borderColor: '#eaeaea !important', // Colore del bordo quando è disabilitato
    },
    '& .Mui-error fieldset': {
      borderColor: theme.palette.error.main, // Colore del bordo in caso di errore
    },
  },
  // Stili per la label
  '&:hover:not(.Mui-disabled) .MuiInputLabel-root:not(.Mui-error)': {
    color: theme.palette.logo.secondary, // Colore della label su hover se non è disabilitata e non è in errore
  },
  '& .MuiInputLabel-root.Mui-error': {
    color: theme.palette.error.main, // Colore della label in caso di errore
  },
}));
