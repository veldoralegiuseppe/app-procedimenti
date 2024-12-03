import './whyDidYouRender';
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material/';

import { Navbar } from '@shared/components';
import { themeOne, ContentGrid } from '@shared/theme';
import { RouteContext, getRoute, ProcedimentoProvider, StoreProvider } from '@shared/context';

const root = createRoot(document.getElementById('mainContainer'));
root.render(<App />);


function App() {
  console.log('App rendered');
  const { currentPath } = React.useContext(RouteContext);
  const [path, setPath] = React.useState(currentPath);

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

  // Memoize the button click handler
  const handleButtonClick = React.useCallback(
    (newPath) => setPath(newPath),
    [setPath]
  );

  return (
    <StoreProvider>
      <RouteContext.Provider
        value={{ currentPath: path, setCurrentPath: setPath }}
      >
        <ThemeProvider theme={themeOne}>
          <CssBaseline />
          <Navbar onButtonClick={handleButtonClick} sx={navbarStyles} />
          <ProcedimentoProvider>
            <ContentGrid container spacing={0} sx={contentGridStyles}>
              {routeComponent}
            </ContentGrid>
          </ProcedimentoProvider>
        </ThemeProvider>
      </RouteContext.Provider>
    </StoreProvider>
  );
}
