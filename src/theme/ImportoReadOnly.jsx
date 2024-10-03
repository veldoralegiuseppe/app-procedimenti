import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';

// Usa Material-UI styled per stili di base
export const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#ccc',  // Colore di default del bordo
    },
    '&:hover fieldset': {
      borderColor: '#ccc',  // Non cambia colore al passaggio del mouse
    },
    '&.Mui-focused fieldset': {
      borderColor: '#ccc',  // Non cambia colore quando è focalizzato
    },
    '&.Mui-disabled fieldset': {
      borderColor: '#ccc',  // Non cambia colore in stato disabilitato
    },
  },
  '& .MuiOutlinedInput-input': {
    userSelect: 'none', // Previene la selezione del testo
    color: theme.palette.text.primary,  // Imposta il colore del testo di default
    cursor: 'not-allowed',  // Mostra il cursore not-allowed anche sul testo
  },
  '& .MuiInputAdornment-root .MuiSvgIcon-root': {
    pointerEvents: 'none',  // Disabilita gli eventi del puntatore sull'icona
  },
  '& .MuiFormLabel-root': {
    color: theme.palette.text.secondary,  // Colore di default della label
    pointerEvents: 'none',  // Disabilita gli eventi del puntatore sull'etichetta
  },
}));