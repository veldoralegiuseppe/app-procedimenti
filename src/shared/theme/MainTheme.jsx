import { createTheme } from '@mui/material/styles';
import { itIT as coreItIT } from '@mui/material/locale';
import { itIT } from '@mui/x-date-pickers/locales';

export const themeOne = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#ED9747',
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
      primary: '#192d4d',
      secondary: '#787878',
      //light: 'rgb(171 178 186)',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
   
  },
  components: {
    MuiPickersToolbar: {
      styleOverrides: {
        root: {
          color: '#ffffff',
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
          borderColor: '#ffffff',
          border: '0px solid',
          backgroundColor: '#ffffff',
        },
      },
    },
  },
  itIT, // x-date-pickers translations
  coreItIT, // core translations
});
