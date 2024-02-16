import * as React from 'react';
import { createRoot } from 'react-dom/client';
import {ThemeProvider } from '@mui/material/styles';
import ResponsiveAppBar from './components/navbar/Navbar.jsx';
import {themeOne, ContentGrid} from '/src/components/Theming.jsx';
import { CssBaseline } from '@mui/material/';
import { AppContext, routes, getRoute } from '/src/store/app-context.jsx';

const root = createRoot(document.getElementById('mainContainer'));
const sideMenuWidth = '16rem'

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
            <ContentGrid container spacing={0} sx={{margin: `0 20px 0 ${sideMenuWidth}`, borderRadius: '8px 8px 0 0', flex: '1', padding: '18px'}}>
              {getRoute(path).component} 
            </ContentGrid>
        </ThemeProvider>
    </AppContext.Provider>
  )
}