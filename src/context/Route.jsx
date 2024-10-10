import * as React from 'react';
import { createContext } from 'react';
import CreaProcedimento from '@pages/CreaProcedimento.jsx';
import Dashboard from '@pages/Dashboard';

export const routes = [
  {
    path: '/dashboard',
    component: <Dashboard />,
  },
  {
    path: '/procedimento',
    children: [
      {
        path: '/crea',
        component: <CreaProcedimento />,
      },
      {
        path: '/cerca',
        component: 'Ricerca provvedimento',
      },
    ],
  },
  {
    path: '/parti',
    component: 'Parti e controparti',
    children: [
      {
        path: '/crea',
        component: 'Crea parte',
      },
      {
        path: '/cerca',
        component: 'Ricerca parte',
      },
    ],
  },
];

export const RouteContext = createContext({
  currentPath: '/dashboard',
  setCurrentPath: undefined,
});

/**
 * Ritorna la Route richiesta o undefined
 * @param {string} path Path per il quale si desidera l'oggetto Route associato
 * @returns Route
 */
export function getRoute(path) {
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
