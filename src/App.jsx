import * as React from 'react';
import { createRoot } from 'react-dom/client';
import {ThemeProvider } from '@mui/material/styles';
import ResponsiveAppBar from './components/navbar/Navbar.jsx';
import {themeOne} from '/src/components/Theming.jsx'
import { styled } from '@mui/system';
import Grid from '@mui/material/Unstable_Grid2';

const root = createRoot(document.getElementById('mainContainer'));
const sideMenuWidth = 170
const ContentGrid = styled(Grid)(({ theme }) =>({
    backgroundColor: '#eef2f6',
    margin: `0 20px 0 ${sideMenuWidth+1}px`,
    height: '100%',
    borderRadius: '8px 8px 0 0',
    [theme.breakpoints.down('md')]: {
      margin: `0 10px 0 10px`,
    }
  }));

root.render( 
    <ThemeProvider theme={themeOne}>
        <ResponsiveAppBar drawerWidth={sideMenuWidth}></ResponsiveAppBar>
        <ContentGrid container sx={{height: '100%'}}>
            <Grid></Grid>
        </ContentGrid>
    </ThemeProvider>
);
