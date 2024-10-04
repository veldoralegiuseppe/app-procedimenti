import { createTheme } from '@mui/material/styles';
import { styled } from '@mui/system';
import Grid from '@mui/material/Grid2';
import { itIT as coreItIT } from '@mui/material/locale';
import { itIT } from '@mui/x-date-pickers/locales';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import { Button } from '@mui/material';

// Costanti
export const labelColor = 'rgb(105 105 105 / 60%)';
export const labelDisableColor = 'rgb(148 148 148 / 60%)';

// Tema
export const themeOne = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#ed9747',
      light: '#ffe5c8',
    },
    secondary: {
      main: '#bbdefb',
      //light: '#f7bc6f',
    },
    logo: {
      primary: '#467bae',
      secondary: '#ed9747',
    },
    dropdown: {
      primary: '#fdf7f1',
      hover: 'rgba(251, 134, 0, 0.125)',
      selected: '#ffb25c',
    },
    text: {
      primary: '#656565',
      secondary: '#787878',
      //light: 'rgb(171 178 186)',
    },
    background: {
      default: 'rgb(255,255,255)',
      paper: '#eef2f6',
    },
  },
  components: {
    MuiPickersToolbar: {
      styleOverrides: {
        root: {
          color: 'white',
          borderRadius: 2,
          borderWidth: 1,
          borderColor: '#2196f3',
          border: '1px solid',
          backgroundColor: '#fb8500',
        },
      },
    },
    MuiDateCalendar: {
      styleOverrides: {
        root: {
          color: '#fb8500',
          borderRadius: 2,
          borderWidth: 1,
          borderColor: 'white',
          border: '0px solid',
          backgroundColor: 'white',
        },
      },
    },
  },
  itIT, // x-date-pickers translations
  coreItIT, // core translations
});
var temaScelto = themeOne;

// Styiled component
export const ContentGrid = styled(Grid)({
  backgroundColor: temaScelto.palette.background.paper,
  padding: '16px',
  [temaScelto.breakpoints.down('md')]: {
    margin: `0 19px`,
  },
});

export const CssSelect = styled(Select)(({ theme }) => ({
  '&.Mui-disabled': {
    backgroundColor: '#efefef73',
  },
  '& .MuiSvgIcon-root': {
    fill: labelColor, // Colore di default della freccia
  },
  '&:hover .MuiSvgIcon-root:not(.Mui-error), &.Mui-focused .MuiSvgIcon-root:not(.Mui-error)':
    {
      fill: theme.palette.logo.secondary, // Colore secondario quando selezionato o su hover
    },
  '& .MuiSvgIcon-root.Mui-error': {
    fill: theme.palette.error.main, // Colore della freccia in caso di errore
  },
  '& .MuiOutlinedInput-root': {
    '&:hover fieldset:not(.Mui-error)': {
      borderColor: theme.palette.logo.secondary, // Colore del bordo su hover se non c'è errore
    },
    '&.Mui-focused fieldset:not(.Mui-error)': {
      borderColor: theme.palette.logo.secondary, // Colore del bordo quando in focus se non c'è errore
    },
    '& .Mui-error fieldset': {
      borderColor: theme.palette.error.main, // Colore del bordo in caso di errore
    },
  },
  // Stili per la label
  '&:hover .MuiInputLabel-root:not(.Mui-error), &.Mui-focused .MuiInputLabel-root:not(.Mui-error)':
    {
      color: theme.palette.logo.secondary, // Colore della label su hover o focus
    },
  '& .MuiInputLabel-root.Mui-error': {
    color: theme.palette.error.main, // Colore della label in caso di errore
  },
}));

export const CssTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputLabel-root:not(.Mui-error, .Mui-disabled, .Mui-focused)': {
    color: labelColor, // Colore di default della label
  },
  '& .MuiInputLabel-root.Mui-error': {
    color: theme.palette.error.main, // Colore della label in caso di errore
  },
  '& .MuiOutlinedInput-root': {
    input: { textTransform: 'uppercase' },
    '&.Mui-disabled': { backgroundColor: '#efefef73' },
    '&.Mui-disabled fieldset': { borderColor: '#eaeaea' },
    '&:hover:not(.Mui-disabled, .Mui-error) fieldset': {
      borderColor: theme.palette.logo.secondary,
    },
    '&.Mui-focused.Mui-error fieldset': { borderWidth: '1.2px' },
    '&.Mui-focused:not(.Mui-error) fieldset': {
      border: `1.2px solid ${theme.palette.logo.secondary}`,
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

export const ClearButton = styled(Button)(({ theme }) => ({
  // '&':{
  //   color: '#467bae61',
  //   border: `1px solid #467bae61`,
  // },

  // '& .MuiButtonBase-root span svg':{
  //   fill: '#467bae61',
  // },

  '&.Mui-disabled': {
    backgroundColor: '#f4f4f4',
    borderColor: '#f1f1f1',
  },
}));

export const formControlStyles = (theme, labelColor) => ({
  minWidth: '133.5px',
  maxWidth: '168px',
  margin: '14px 20px 10px 0px',
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderWidth: '1px', // Imposta lo spessore del bordo a 1px
    },
    '&:hover fieldset': {
      borderColor: theme.palette.logo.secondary, // Colore del bordo su hover
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.logo.secondary, // Colore del bordo su focus
      borderWidth: '1px', // Mantiene lo spessore del bordo a 1px anche in focus
    },
  },
  '&:hover .MuiInputLabel-root:not(.Mui-disabled, .Mui-error)': {
    color: theme.palette.logo.secondary, // Cambia il colore della label su hover
  },
  '& .MuiInputLabel-outlined.Mui-focused': {
    color: theme.palette.logo.secondary, // Cambia il colore della label quando è in focus
  },
  '& .MuiInputLabel-outlined.Mui-disabled': {
    color: theme.palette.text.disabled, // Colore della label quando è disabilitata
  },
  '& .MuiInputLabel-outlined': {
    transform: 'translate(14px, 8px) scale(1)', // Posizionamento centrato di default
  },
  '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
    transform: 'translate(14px, -8px) scale(0.75)', // Posizionamento della label ridotta
  },
  '& .MuiSvgIcon-root': {
    fill: labelColor, // Cambia il colore dell'icona della freccia di default
  },
  '&:hover .MuiSvgIcon-root, &.Mui-focused .MuiSvgIcon-root': {
    fill: theme.palette.logo.secondary, // Cambia il colore dell'icona su hover e focus
  },
});
