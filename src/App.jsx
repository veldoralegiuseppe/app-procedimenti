import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material/';

import Navbar from '@components/Navbar';
import { themeOne, ContentGrid } from '@theme/MainTheme';
import { RouteContext, getRoute } from '@context/Route';


const root = createRoot(document.getElementById('mainContainer'));


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
        <Navbar 
          onButtonClick={setPath} 
          sx={{
            transition: 'background-color 0.3s ease', // transizione per cambio di colore
            '&:hover': {
              backgroundColor: 'primary.main', // effetto hover
            },
          }}
        ></Navbar>
        <ContentGrid
          container 
          spacing={0} 
          sx={{
            margin: `0 !important`,
            backgroundColor: 'background.paper',
            padding: '2rem 4.8rem',
            minHeight: '100vh',
            minWidth: '100%',
          }}
        >
          {getRoute(path).component}
        </ContentGrid>
      </ThemeProvider>
    </RouteContext.Provider>
  );
}
