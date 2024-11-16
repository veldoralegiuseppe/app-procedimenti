import * as React from 'react';
import { createContext } from 'react';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { CssTextField } from '@theme/MainTheme';

import CreaProcedimento from '@pages/CreaProcedimento.jsx';
import Dashboard from '@pages/Dashboard';
import ProcedimentoFormContainer from '@components/forms/ProcedimentoFormContainer';
import TableFactory from '@components/factories/tableFactory/TableFactory';
import { minHeight, styled } from '@mui/system';
import { TableCell, TableHead } from '@mui/material';


const data = [
  { id: 1, name: 'Alice', age: 25 },
  { id: 2, name: 'Bob', age: 30 },
  { id: 3, name: 'Charlie', age: 35 },
];

const headerConfig = {
  
  columns: [
    { field: 'id', headerName: 'ID', sortable: true },
    { field: 'name', headerName: 'Name', sortable: true },
    { field: 'age', headerName: 'Age', sortable: false },
  ],
  onSort: (field, order) => {
    console.log('Ordinamento:', field, order);
  },
  components: {
    TableHead: styled(TableHead)(({ theme }) => ({
      backgroundColor: theme.palette.background.default,
    })),

    TableCell: styled(TableCell)(({ theme }) => ({
      color: '#4a769b',
      fontSize: '1rem',
      textTransform: 'uppercase',
      fontWeight: '500',
      backgroundColor: '#ecf6ff',
      borderBottom: '1px solid #3e678f4d',
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
  data,
  columns: headerConfig.columns,
  onRowClick: (row) => console.log('Riga cliccata:', row),
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
    onSelect: (row) => console.log('Riga selezionata:', row),
    isSelected: (row) => row.id === 1, // Esempio: seleziona solo la riga con ID 1
  },
  sx: {'& .MuiTableCell-root': {paddingLeft: '4px'}},
};

const footerConfig = {
  pagination: true,
  data,
  page: 0,
  rowsPerPage: 5,
  sx: {minHeight: '3rem'},
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
            footerConfig={footerConfig}
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
