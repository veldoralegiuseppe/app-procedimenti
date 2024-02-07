import { createTheme } from '@mui/material/styles';
import { styled } from '@mui/system';
import Grid from '@mui/material/Unstable_Grid2';

export const themeOne = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#5690f2',
      light: '#c3e1ff',
    },
    secondary: {
      main: '#ed9747',
      light: '#f7bc6f',
    },
    text: {
      primary: '#121926',
    },
    background: {
      default: '#ffffff',
      paper: '#eef2f6',
    },
  },

});

var temaScelto = themeOne

export const ContentGrid = styled(Grid)({
  backgroundColor: temaScelto.palette.background.paper,
  [temaScelto.breakpoints.down('md')]: {
    margin: `0 10px 0 10px`,
  }
});
