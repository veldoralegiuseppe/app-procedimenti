import * as React from 'react';
import { createContext } from 'react';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

import {CreaProcedimento, Dashboard} from '@pages';
import {FormDatiGeneraliContainer, useProcedimento, Procedimento} from '@features/procedimento';
import {ComponentFactory} from '@shared/factories';
import {FormPresenter, FormContainer} from '@shared/components';

const MyComponent = () => {
  // Memoizza la configurazione del modello
  const config = React.useMemo(() => ({
    model: { class: Procedimento },
  }), []);

  // Memoizza le sezioni
  const sezioni = React.useMemo(() => ['Istanza di mediazione'], []);

  return (
    <FormContainer
      config={config} // Config stabilizzata
      store={useProcedimento} // Store Zustand come funzione
      sezioni={sezioni} // Sezioni stabilizzate
    />
  );
};


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
          // <TabellaPartiControparti />
          //<TabellaTransazioni data={data} rowConfig={rowConfig}/>
          //<ProcedimentoFormContainer />
          <FormDatiGeneraliContainer/>
          //<ComponentFactory.InputFactory store={useProcedimento} fieldKey={"dataDeposito"}/>
          // <FormPresenter
          //   sezione="Istanza di mediazione"
          //   store={useProcedimento}
          //   errors={{}}
          //   campi={Object.values(Procedimento.getMetadati()).filter(
          //     (c) => c.sezione === 'Istanza di mediazione'
          //   )}
          // />
          // <MyComponent />
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
