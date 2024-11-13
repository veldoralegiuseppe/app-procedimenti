import * as React from 'react';
import { createContext } from 'react';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { CssTextField } from '@theme/MainTheme';

import CreaProcedimento from '@pages/CreaProcedimento.jsx';
import Dashboard from '@pages/Dashboard';
import RuleBuilder from '@components/RuleBuilders/RuleBuilder';
import ProcedimentoFormContainer from '@components/forms/ProcedimentoFormContainer';
import OptionsAutocomplete from '@components/commons/OptionsAutocomplete';
import TitoliAutocomplete from '@components/features/persona/TitoliAutocomplete';

export const routes = [
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
        component: <CreaProcedimento />,
      },
      {
        path: '/cerca',
        icon: <SearchOutlinedIcon />,
        label: 'Ricerca procedimento',
        component: (
          <ProcedimentoFormContainer />
        ),
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
