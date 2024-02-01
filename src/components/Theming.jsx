import { createTheme } from '@mui/material/styles';

export const themeOne = createTheme({
    palette: {
        mode: 'light',
        primary: {
          main: '#5690f2',
        },
        secondary: {
          main: '#ed9747',
        },
        text: {
          primary: '#212121',
        },
    },
});


export const headerTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
          main: '#f5f5f5',
          contrastText: '#5690f2',
        },
        secondary: {
          main: '#ed9747',
        },
        text: {
          primary: '#212121',
        },
    },
});