import * as React from 'react';
import { styled } from '@mui/system';
import { TableCell, TableHead } from '@mui/material';
import Grid from '@mui/material/Grid2';
import TableFactory from '@components/factories/TableFactory/TableFactory';
import TransazioneCellRender from './components/TransazioneCellRender';
import { useTransazioneTableRow } from './hooks/useTransazioneTableRow';
import Totali from './components/Totali';

const TabellaTransazioniComponent = ({ store, disabled, onChange, onBlur, errors, totali }) => {
  const { data } = useTransazioneTableRow({store, disabled, onChange, onBlur, errors});

  const columns = React.useMemo(() => [
    {
      field: 'nome',
      type: 'custom',
      render: TransazioneCellRender,
      headerName: 'Transazione',
    },
    {
      field: 'importoDovuto',
      headerName: 'Importo dovuto',
      type: 'input',
      sx: { width: '27%' },
    },
    {
      field: 'importoCorrisposto',
      headerName: 'Importo corrisposto',
      type: 'input',
      sx: { width: '27%' },
    },
    {
      field: 'stato',
      headerName: 'Stato',
      type: 'infoChip',
      sx: { width: '20%' },
      align: 'center',
    },
  ], []);
  
  const headerConfig = React.useMemo(() => ({
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
        padding: '4px',
        '& .MuiButtonBase-root:hover': {
          color: '#4596de',
          '& svg': { opacity: '0.8' },
        },
        '& .MuiButtonBase-root.Mui-active': {
          color: theme.palette.logo.secondary,
          '& svg': { color: theme.palette.logo.secondary },
        },
      })),
    },
  }), []);

  return (
    <Grid container size={{ xs: 12 }} sx={{rowGap: '1.5rem'}}>
      {/* Tabella transazioni */}
      <TableFactory
        columns={columns}
        data={data}
        headerConfig={headerConfig}
        rowConfig={{ sx: { '& td': { padding: '6px 4px' } } }}
        sx={{
          '& table': {
            tableLayout: 'fixed',
            width: '100%',
            overflowX: 'scroll',
            minWidth: '48rem',
          },
        }}
      />

      {/* Riepilogo totali opzionale */}
      {totali && <Totali totali={totali} />}
    </Grid>
  );
};

const TabellaTransazioni = React.memo(TabellaTransazioniComponent);
TabellaTransazioni.whyDidYouRender = true;

export default TabellaTransazioni;
