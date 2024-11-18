import * as React from 'react';
import { createContext } from 'react';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { CssTextField } from '@theme/MainTheme';

import CreaProcedimento from '@pages/CreaProcedimento.jsx';
import Dashboard from '@pages/Dashboard';
import ProcedimentoFormContainer from '@components/forms/ProcedimentoFormContainer';
import TableFactory from '@components/factories/TableFactory/TableFactory';
import { styled } from '@mui/system';
import { TableCell, TableHead } from '@mui/material';

const headerConfig = {
  onSort: (field, order) => {
    console.log('Ordinamento:', field, order);
  },
  components: {
    TableHead: styled(TableHead)(({ theme }) => ({
      backgroundColor: theme.palette.background.default,
    })),

    TableCell: styled(TableCell)(({ theme }) => ({
      color: '#255a89',
      fontSize: '1rem',
      textTransform: 'uppercase',
      fontWeight: '500',
      backgroundColor: '#c8dcec',
      //borderBottom: '1px solid #3e678f4d',
      '& .MuiButtonBase-root:hover': { color: '#ff9f32a8' },
      '& .MuiButtonBase-root.Mui-active': {
        color: theme.palette.logo.secondary,
        '& svg': { color: theme.palette.logo.secondary },
      },
      padding: '4px',
    })),
  },
};

const rowConfig = {
  //onRowClick: (row) => console.log('Riga cliccata:', row),
  collapsibleConfig: {
    renderComponent: (row) => (
      <div>
        <h4>Dettagli di {row.name}</h4>
        <p>ID: {row.id}</p>
        <p>Età: {row.age}</p>
      </div>
    ),
  },
  selectableConfig: {
    isMultiSelect: false,
    initialSelected: [1],
    onSelected: (selected) => console.log('Selezionati:', selected),
  },
  sx: { '& .MuiTableCell-root': { paddingLeft: '4px' } },
};

const footerConfig = {
  pagination: true,
  page: 0,
  rowsPerPage: 5,
  sx: { minHeight: '3rem' },
  onPageChange: (event, newPage) => console.log('Pagina cambiata:', newPage),
  onRowsPerPageChange: (event) =>
    console.log('Righe per pagina cambiate:', event.target.value),
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
          <TableFactory
            headerConfig={headerConfig}
            rowConfig={rowConfig}
            sx={{border: '1px solid rgba(224, 224, 224, 1)', borderTop: 'none', borderBottom: 'none'}}
            footerConfig={footerConfig}
            columns={[
             
              { field: 'name', headerName: 'Name', type: 'chip', sortable: true, align: 'center' },
              { field: 'age', headerName: 'Age', type: 'input', sortable: false, align: 'center' },
            ]}
            data={[
              {name: {value: 'Alice', status: 'error'}, age: {fieldKey: 'valoreControversia', value: 0} },
              {name: {value: 'Bob', status: 'correct'}, age: {component: CssTextField, label: 'Custom'} },
              // {name: {value: 'Charlie', status: 'warning'}, age: 35 },
            ]}
          />
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
