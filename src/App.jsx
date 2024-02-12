import * as React from 'react';
import { createRoot } from 'react-dom/client';
import {ThemeProvider } from '@mui/material/styles';
import ResponsiveAppBar from './components/navbar/Navbar.jsx';
import {themeOne, ContentGrid} from '/src/components/Theming.jsx';
import Grid from '@mui/material/Unstable_Grid2';
import { CssBaseline } from '@mui/material/';
import { AppContext, routes, getRoute } from '/src/store/app-context.jsx';

const root = createRoot(document.getElementById('mainContainer'));
const sideMenuWidth = 170

root.render( 
    <App></App>
);

function App(){
 
  var {currentPath} = React.useContext(AppContext);
  const [path, setPath] = React.useState(currentPath);

  return (
    <AppContext.Provider value={{currentPath: path, setCurrentPath: setPath}}>
        <ThemeProvider theme={themeOne}>
            <CssBaseline/>
            <ResponsiveAppBar drawerWidth={sideMenuWidth} onButtonClick={ setPath }></ResponsiveAppBar>
            <ContentGrid container sx={{margin: `0 20px 0 ${sideMenuWidth}px`, borderRadius: '8px 8px 0 0', flex: '1'}}>
               
                    {getRoute(path).component}
                
            </ContentGrid>
        </ThemeProvider>
    </AppContext.Provider>
  )
}