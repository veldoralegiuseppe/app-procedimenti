import * as React from 'react';
import { createRoot } from 'react-dom/client';
import {ThemeProvider } from '@mui/material/styles';
import ResponsiveAppBar from './components/navbar/Navbar.jsx';
import {themeOne, ContentGrid} from '/src/components/Theming.jsx';
import Grid from '@mui/material/Unstable_Grid2';
import { CssBaseline } from '@mui/material/';
import { AppContext, routes } from '/src/store/app-context.jsx';

const root = createRoot(document.getElementById('mainContainer'));
const sideMenuWidth = 170

root.render( 
    <App></App>
);

function App(){
 
  var {currentPath} = React.useContext(AppContext);
  const [path, setPath] = React.useState(currentPath);

  function RoutingProvider({path}){
    var regex = /\/[a-zA-Z]+/g
    var subPath = path.match(regex)
   
    if(subPath.length == 1) 
        return routes.filter( route => route.path === path).map(route => (route.component))
    else{
        var routeArray = routes.filter( route => route.path === subPath[0])
        console.log(JSON.stringify(routeArray))
        for(var i=1; i<subPath.length; i++){
            var routeArray = routeArray[0].children.filter( route => route.path === subPath[i])
        }

        return routeArray[0].component
    }
        
  }
  
  return (
    <AppContext.Provider value={{currentPath: path}}>
        <ThemeProvider theme={themeOne}>
            <CssBaseline/>
            <ResponsiveAppBar drawerWidth={sideMenuWidth} onButtonClick={ setPath }></ResponsiveAppBar>
            <ContentGrid container sx={{margin: `0 20px 0 ${sideMenuWidth}px`, height: '100%', borderRadius: '8px 8px 0 0',}}>
                <Grid>
                    <RoutingProvider path={path}/>
                </Grid>
            </ContentGrid>
        </ThemeProvider>
    </AppContext.Provider>
  )
}