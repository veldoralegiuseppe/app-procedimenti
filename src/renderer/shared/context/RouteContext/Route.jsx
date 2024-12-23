import * as React from 'react';
import { createContext } from 'react';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import {
  CreazioneProcedimentoPage,
  Dashboard,
  RicercaProcedimentoPage,
} from '@pages';

const INITIAL_PATH = '/dashboard';

const routes = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    component: <Dashboard />,
  },
  {
    path: '/procedimento',
    label: 'Procedimento',
    children: [
      {
        path: '/crea',
        label: 'Nuovo procedimento',
        icon: <AddOutlinedIcon />,
        component: <CreazioneProcedimentoPage />,
      },
      {
        path: '/cerca',
        icon: <SearchOutlinedIcon />,
        label: 'Ricerca procedimento',
        component: <RicercaProcedimentoPage />,
      },
    ],
  },
  {
    path: '/parti',
    label: 'Parti',
    component: 'Parti e controparti',
    children: [
      {
        path: '/crea',
        label: 'Nuova parte',
        component: 'Crea parte',
      },
      {
        path: '/cerca',
        label: 'Ricerca parte',
        component: 'Ricerca parte',
      },
    ],
  },
];

/**
 * Ritorna la Route richiesta o undefined
 * @param {string} path Path per il quale si desidera l'oggetto Route associato
 * @returns Route
 */
function getRoute(path) {
  var regex = /\/[a-zA-Z]+/g;
  var subPath = path.match(regex);

  if (subPath.length == 1)
    return routes.filter((route) => route.path === path)[0];
  else {
    var routeArray = routes.filter((route) => route.path === subPath[0]);

    for (var i = 1; i < subPath.length; i++) {
      if (routeArray)
        routeArray = routeArray[0].children.filter(
          (route) => route.path === subPath[i]
        );
      else break;
    }

    return routeArray ? routeArray[0] : undefined;
  }
}

export const RouteContext = createContext({
  currentPath: INITIAL_PATH,
  setCurrentPath: undefined,
  routes,
  getRoute,
});

export const RouteProvider = ({ children }) => {
  const [path, setPath] = React.useState(INITIAL_PATH);

  const handleChangePath = React.useCallback(
    (newPath) => {
      console.log('handleChangePath', newPath);
      setPath(newPath);
    },
    [setPath]
  );

  const handleGetRoutes = React.useCallback(
    (path) => getRoute(path),
    [getRoute]
  );

  const routesMemo = React.useMemo(() => routes, [routes]);

  return (
    <RouteContext.Provider
      value={{
        currentPath: path,
        setCurrentPath: handleChangePath,
        getRoute: handleGetRoutes,
        routes: routesMemo,
      }}
    >
      {children}
    </RouteContext.Provider>
  );
};
