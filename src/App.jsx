import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material/';

import ResponsiveAppBar from '@components/Navbar';
import { themeOne, ContentGrid } from '@theme/MainTheme';
import { RouteContext, routes, getRoute } from '@context/Route';

const root = createRoot(document.getElementById('mainContainer'));
const sideMenuWidth = '60px';

root.render(<App></App>);

function App() {
  var { currentPath } = React.useContext(RouteContext);
  const [path, setPath] = React.useState(currentPath);

  return (
    <RouteContext.Provider
      value={{ currentPath: path, setCurrentPath: setPath }}
    >
      <ThemeProvider theme={themeOne}>
        <CssBaseline />
        <ResponsiveAppBar
          drawerWidth={sideMenuWidth} 
          onButtonClick={setPath} 
          sx={{
            transition: 'background-color 0.3s ease', // transizione per cambio di colore
            '&:hover': {
              backgroundColor: 'primary.main', // effetto hover
            },
          }}
        ></ResponsiveAppBar>
        <ContentGrid
          container 
          spacing={0} 
          sx={{
            margin: `0 0 0 ${sideMenuWidth}`, 
            borderRadius: '8px', // angoli arrotondati per un design simile ai tooltip
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // effetto ombra per dare la sensazione di sovrapposizione come i tooltip
            backgroundColor: 'background.paper', // colore di sfondo neutro
            padding: '12px 25px', // ridotto leggermente il padding
          }}
        >
          {getRoute(path).component}
        </ContentGrid>
      </ThemeProvider>
    </RouteContext.Provider>
  );
}
