import * as React from 'react';
import { createRoot } from 'react-dom/client';
import {ThemeProvider } from '@mui/material/styles';
import ResponsiveAppBar from './components/navbar/Navbar.jsx';
import {themeOne} from '/src/components/Theming.jsx'

/**
 * Tema 
 */
var temaScelto = themeOne

/**
 * Entry point
 */
const root = createRoot(document.body);

root.render( 
    <ThemeProvider theme={temaScelto}>
        <ResponsiveAppBar></ResponsiveAppBar>
    </ThemeProvider>
);
