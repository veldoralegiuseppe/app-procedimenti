import './whyDidYouRender';
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material/';

import { Navbar } from '@ui-shared/components';
import { themeOne, ContentGrid } from '@ui-shared/theme';
import { ProcedimentoProvider, StoreProvider, RouteProvider, useRouteContext } from '@ui-shared/context';

const root = createRoot(document.getElementById('mainContainer'));
root.render(<App />);


function App() {
  
  const {getRoute, currentPath} = useRouteContext()
  const [path, setPath] = React.useState(() => currentPath);

  const onButtonClick = (newPath) => {
    setPath(newPath);
  };

  // Memoize route component
  const routeComponent = React.useMemo(() => getRoute(path).component, [path]);

  // Memoize styles
  const navbarStyles = React.useMemo(
    () => ({
      transition: 'background-color 0.3s ease',
      '&:hover': {
        backgroundColor: 'primary.main',
      },
    }),
    []
  );

  const contentGridStyles = React.useMemo(
    () => ({
      margin: `0 !important`,
      backgroundColor: 'background.paper',
      padding: '2rem 5rem',
      minWidth: '100%',
    }),
    []
  );


  return (
    <StoreProvider>
      <RouteProvider>
        <ThemeProvider theme={themeOne}>
          <CssBaseline />
          <Navbar onButtonClick={onButtonClick} sx={navbarStyles} />
          <ProcedimentoProvider>
            <ContentGrid container spacing={0} sx={contentGridStyles}>
              {routeComponent}
            </ContentGrid>
          </ProcedimentoProvider>
        </ThemeProvider>
      </RouteProvider>
    </StoreProvider>
  );
}
