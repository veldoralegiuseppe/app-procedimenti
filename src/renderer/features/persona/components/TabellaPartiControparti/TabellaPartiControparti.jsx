import * as React from 'react';
import { TableFactory } from '@ui-shared/components';
import { styled } from '@mui/system';
import { TableCell, TableHead } from '@mui/material';
import { useStoreContext } from '@ui-shared/context';
import { FieldTypes } from '@ui-shared/metadata';
import usePersoneTableRow from './hooks/usePersoneTableRow';

const columns = [
  {
    field: 'anagrafica',
    headerName: 'Anagrafica',
    sortable: true,
    align: 'left',
  },
  {
    field: 'ruolo',
    headerName: 'Ruolo',
    sortable: true,
    align: 'left',
  },
  {
    field: 'speseAvvio',
    headerName: 'Spese avvio',
    sortable: true,
    align: 'center',
  },
  {
    field: 'spesePostali',
    headerName: 'Spese postali',
    sortable: true,
    align: 'center',
  },
  {
    field: 'speseIndennita',
    headerName: 'Indennità',
    sortable: true,
    align: 'center',
  },
  {
    field: 'spesePositivoPrimoIncontro',
    headerName: 'Pos. 1°',
    tooltip: 'Positivo 1° incontro',
    sortable: true,
    align: 'center',
  },
  {
    field: 'spesePositivoOltrePrimoIncontro',
    headerName: 'Pos. oltre 1°',
    tooltip: 'Positivo oltre 1° incontro',
    sortable: true,
    align: 'center',
  },
  {
    field: 'speseMancatoAccordo',
    headerName: 'Manc. accordo',
    tooltip: 'Mancato accordo',
    sortable: true,
    align: 'center',
  },
  {
    field: 'totale',
    headerName: 'Totale',
    sortable: true,
    align: 'center',
  },
];



const TabellaPartiControparti = ({onRowSelected}) => {
  const personeStore = useStoreContext(FieldTypes.PERSONE);
  const persone = personeStore((state) => state.getItems());
  const { data } = usePersoneTableRow({ persone });

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
        console.log('Selezionati:', selezionati)
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
    onRowsPerPageChange: (event) =>
      console.log('Righe per pagina cambiate:', event.target.value),
  };

  React.useEffect(() => {
    const validateData = (data) => {
      if (persone.length === 0) return true;
      return data.every((item) =>
        columns.every((column) => column.field in item)
      );
    };

    if (!validateData(data)) {
      console.error(
        'I dati forniti non rispettano il formato specificato dalle colonne.'
      );
    }
  }, [data]);

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

export default TabellaPartiControparti;
