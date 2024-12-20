import { styled } from '@mui/system';
import TextField from '@mui/material/TextField';
import { labelColor } from '@shared/theme';

export const CssTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputLabel-root:not(.Mui-error, .Mui-disabled, .Mui-focused)': {
    color: labelColor, // Colore di default della label
  },
  '& .MuiInputLabel-root.Mui-error': {
    color: theme.palette.error.main, // Colore della label in caso di errore
  },
  '& .MuiInputLabel-root.Mui-disabled': {
    color: 'rgba(0, 0, 0, 0.38) !important', // Colore della label quando disabilitata
  },
  '& .MuiOutlinedInput-root': {
    input: { textTransform: 'uppercase' },
    '&.Mui-disabled': {
      backgroundColor: '#efefef73', // Colore di sfondo per input disabilitato
    },
    '&.Mui-disabled fieldset': {
      borderColor: '#eaeaea', // Colore del bordo quando l'input è disabilitato
    },
    '&:hover:not(.Mui-disabled, .Mui-error) fieldset': {
      borderColor: theme.palette.logo.secondary, // Colore del bordo su hover se non disabilitato o in errore
    },
    '&.Mui-focused.Mui-error fieldset': {
      borderWidth: '1.2px',
    },
    '&.Mui-focused:not(.Mui-error) fieldset': {
      border: `1.2px solid ${theme.palette.logo.secondary}`, // Colore del bordo su focus se non in errore
    },

    // Icona di default
    '& .MuiSvgIcon-root': {
      fill: labelColor, // Colore di default dell'icona
    },

    // Hover sull'icona
    '&:hover .MuiSvgIcon-root:not(.Mui-disabled, .Mui-error)': {
      fill: theme.palette.logo.secondary, // Colore dell'icona su hover
    },

    // Focus sull'icona
    '&.Mui-focused:not(.Mui-error) .MuiSvgIcon-root': {
      fill: theme.palette.logo.secondary, // Colore dell'icona su focus
    },
  },

  // Hover sincronizzato sulla label, l'icona e il bordo (fieldset)
  '&:hover .MuiInputLabel-root:not(.Mui-error, .Mui-disabled), &:hover .MuiOutlinedInput-root:not(.Mui-disabled, .Mui-error) fieldset':
    {
      color: theme.palette.logo.secondary, // Colore della label su hover
      borderColor: theme.palette.logo.secondary, // Colore del bordo su hover
    },

  // Sincronizza hover per l'icona quando la label è in hover
  '&:hover .MuiInputLabel-root:not(.Mui-error, .Mui-disabled) ~ .MuiOutlinedInput-root .MuiSvgIcon-root':
    {
      fill: theme.palette.logo.secondary, // Colore dell'icona su hover della label
    },

  // Focus sincronizzato sulla label e l'intero campo
  '& .MuiInputLabel-root.Mui-focused:not(.Mui-error), & .MuiOutlinedInput-root.Mui-focused:not(.Mui-error) fieldset':
    {
      color: theme.palette.logo.secondary, // Colore della label su focus
      borderColor: theme.palette.logo.secondary, // Colore del bordo su focus
    },
}));
