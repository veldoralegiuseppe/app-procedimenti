import * as React from 'react';
import { createRoot } from 'react-dom/client';
import {ThemeProvider } from '@mui/material/styles';
import ResponsiveAppBar from './components/navbar/Navbar.jsx';
import {themeOne, ContentGrid} from '/src/components/Theming.jsx';
import Grid from '@mui/material/Unstable_Grid2';
import { CssBaseline } from '@mui/material/';
import { AppContext } from '/src/store/app-context.jsx';

const root = createRoot(document.getElementById('mainContainer'));
const sideMenuWidth = 170

root.render( 
    <App></App>
);

function App(){
 
  const [path, setPath] = React.useState('/dashboard');

  return (
    <AppContext.Provider value={{currentPath: path}}>
        <ThemeProvider theme={themeOne}>
            <CssBaseline/>
            <ResponsiveAppBar drawerWidth={sideMenuWidth} onButtonClick={ setPath }></ResponsiveAppBar>
            <ContentGrid container sx={{margin: `0 20px 0 ${sideMenuWidth}px`, height: '100%', borderRadius: '8px 8px 0 0',}}>
                <Grid></Grid>
            </ContentGrid>
        </ThemeProvider>
    </AppContext.Provider>
  )
}