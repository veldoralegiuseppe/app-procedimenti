import * as React from 'react';
import {TableFactory} from '@shared/factories';
import { styled } from '@mui/system';
import { TableCell, TableHead } from '@mui/material';

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
    align: 'left',
  },
  {
    field: 'spesePostali',
    headerName: 'Spese postali',
    sortable: true,
    align: 'left',
  },
  {
    field: 'indennita',
    headerName: 'Indennità',
    sortable: true,
    align: 'left',
  },
  {
    field: 'importoPositivoPrimoIncontro',
    headerName: 'Pos. 1°',
    tooltip: 'Positivo 1° incontro',
    sortable: true,
    align: 'left',
  },
  {
    field: 'importoPositivoOltrePrimoIncontro',
    headerName: 'Pos. oltre 1°',
    tooltip: 'Positivo oltre 1° incontro',
    sortable: true,
    align: 'left',
  },
  {
    field: 'importoMancatoAccordo',
    headerName: 'Manc. accordo',
    tooltip: 'Mancato accordo',
    sortable: true,
    align: 'left',
  },
  {
    field: 'totale',
    headerName: 'Totale',
    sortable: true,
    align: 'left',
  },
];

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
    renderComponent: (row) => (
      <div>
        <h4>Dettagli di {row.name}</h4>
        <p>ID: {row.id}</p>
        <p>Età: {row.age}</p>
      </div>
    ),
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

const TabellaPartiControparti = ({ persone = [] }) => {
  React.useEffect(() => {
    const validateData = (data) => {
      if (persone.length === 0) return true;
      return data.every((item) =>
        columns.every((column) => column.field in item)
      );
    };

    if (!validateData(persone)) {
      console.error(
        'I dati forniti non rispettano il formato specificato dalle colonne.'
      );
    }
  }, [persone]);

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
      data={persone}
    />
  );
};

export default TabellaPartiControparti;
