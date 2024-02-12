import { createTheme } from '@mui/material/styles';
import { styled } from '@mui/system';
import Grid from '@mui/material/Unstable_Grid2';
import { itIT as coreItIT } from '@mui/material/locale';
import { itIT } from '@mui/x-date-pickers/locales';

export const themeOne = createTheme(
  {
    palette: {
      mode: 'light',
      primary: {
        main: '#fb8500',
        light: '#ffe5c8'
      },
      secondary: {
        main: '#bbdefb',
        //light: '#f7bc6f',
      },
      logo:{
        primary: '#4b62a2',
        secondary: '#ed9747',
      },
      text: {
        primary: '#555353',
        light: 'rgb(171 178 186)',
      },
      background: {
        default: '#ffffff',
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
          }
        }
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
          }
        }
      }
    },
    itIT, // x-date-pickers translations
    coreItIT, // core translations
  }
);

var temaScelto = themeOne

export const ContentGrid = styled(Grid)({
  backgroundColor: temaScelto.palette.background.paper,
  padding: '16px',
  [temaScelto.breakpoints.down('md')]: {
    margin: `0 19px`,
  }
});
