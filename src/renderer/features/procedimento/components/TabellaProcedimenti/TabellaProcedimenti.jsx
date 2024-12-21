import * as React from 'react';
import { TableFactory } from '@ui-shared/components';
import { styled } from '@mui/system';
import { TableCell, TableHead } from '@mui/material';
import useProcedimentoTableRow from './hooks/useProcedimentoTableRow';

const columns = [
  {
    field: 'numProtocollo',
    headerName: 'Protocollo',
    sortable: true,
    align: 'center',
  },
  {
    field: 'dataDeposito',
    headerName: 'Data deposito',
    sortable: true,
    align: 'center',
  },
  {
    field: 'oggettoControversia',
    headerName: 'Oggetto',
    sortable: true,
    align: 'center',
  },
  {
    field: 'valoreControversia',
    headerName: 'Valore controversia',
    sortable: true,
    align: 'center',
  },
  {
    field: 'esitoMediazione',
    headerName: 'Esito',
    sortable: true,
    align: 'center',
  },

  {
    field: 'statoPagamenti',
    headerName: 'Stato',
    type: 'chip',
    sortable: true,
    align: 'center',
  },
];

const TabellaProcedimenti = ({onRowSelected, procedimenti=[]}) => {

  const { data } = useProcedimentoTableRow({ procedimenti });

  const headerConfig = {
    components: {
      TableHead: styled(TableHead)(({ theme }) => ({
        backgroundColor: theme.palette.background.default,
      })),

      TableCell: styled(TableCell)(({ theme }) => ({
        color: '#255a89',
        fontSize: '1rem',
        textTransform: 'uppercase',
        fontWeight: '500',
        textAlign: 'center',
        backgroundColor: '#c8dcec',
        //borderBottom: '1px solid #3e678f4d',
        '& .MuiButtonBase-root:hover': {
          color: '#4596de',
          '& svg': { opacity: '0.8' },
        },
        '& .MuiButtonBase-root.Mui-active': {
          color: theme.palette.logo.secondary,
          '& svg': { color: theme.palette.logo.secondary },
        },
        padding: '4px',
      })),
    },
  };

  const rowConfig = {
    collapsibleConfig: {
      renderComponent: (row) => {
        console.log('Dettagli di', row);
        return (
          <div>
            <h4>Dettagli di</h4>
            <p>ID:</p>
          </div>
        );
      },
    },
    selectableConfig: {
      isMultiSelect: false,
      onSelected: (selezionati) => {
        onRowSelected?.(selezionati);
      },
    },
    sx: { '& .MuiTableCell-root': { paddingLeft: '4px' } },
  };

  const footerConfig = {
    pagination: true,
    page: 0,
    rowsPerPage: 5,
    sx: { height: '2rem' },
    onPageChange: (event, newPage) => console.log('Pagina cambiata:', newPage),
    onRowsPerPageChange: (event) => {
      console.log('Righe per pagina cambiate:', event.target.value);
    },
  };

  return (
    <TableFactory
      headerConfig={headerConfig}
      rowConfig={rowConfig}
      sx={{
        border: '1px solid rgba(224, 224, 224, 1)',
        borderTop: 'none',
        borderBottom: 'none',
      }}
      footerConfig={footerConfig}
      columns={columns}
      data={data}
    />
  );
};

export default TabellaProcedimenti;
