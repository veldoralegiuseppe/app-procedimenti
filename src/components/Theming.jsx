import { createTheme } from '@mui/material/styles';

export const themeOne = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#5690f2',
      light: '#c3e1ff'
    },
    secondary: {
      main: '#ed9747',
    },
    text: {
      primary: '#121926',
    },
    background: {
      default: '#eef2f6',
      paper: '#ffffff',
    },
  },

});

