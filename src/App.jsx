import * as React from 'react';
import { createRoot } from 'react-dom/client';
import {ThemeProvider } from '@mui/material/styles';
import ResponsiveAppBar from './components/navbar/Navbar.jsx';
import {themeOne, ContentGrid} from '/src/components/Theming.jsx'
import Grid from '@mui/material/Unstable_Grid2';
import { CssBaseline } from '@mui/material/';

const root = createRoot(document.getElementById('mainContainer'));
const sideMenuWidth = 170

root.render( 
    <ThemeProvider theme={themeOne}>
        <CssBaseline/>
        <ResponsiveAppBar drawerWidth={sideMenuWidth}></ResponsiveAppBar>
        <ContentGrid container sx={{margin: `0 20px 0 ${sideMenuWidth}px`, height: '100%', borderRadius: '8px 8px 0 0',}}>
            <Grid></Grid>
        </ContentGrid>
    </ThemeProvider>
);
