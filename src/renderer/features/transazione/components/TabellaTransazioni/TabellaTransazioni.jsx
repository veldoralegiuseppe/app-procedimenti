import * as React from 'react';
import { styled } from '@mui/system';
import { TableCell, TableHead } from '@mui/material';
import Grid from '@mui/material/Grid2';
import {TableFactory} from '@ui-shared/components';
import { ModeTypes } from '@ui-shared/metadata';
import TransazioneCellRender from './components/TransazioneCellRender';
import useTransazioneTableRow  from './hooks/useTransazioneTableRow/useTransazioneTableRow';
import _ from 'lodash';

const TabellaTransazioniComponent = ({ transazioni, disabled, onChange, onBlur, errors, mode=ModeTypes.CREATE}) => {
  const { data } = useTransazioneTableRow({transazioni, disabled, onChange, onBlur, errors, mode});

  const columns = React.useMemo(() => [
    {
      field: 'nome',
      type: 'custom',
      render: TransazioneCellRender,
      headerName: 'Transazione',
      align: mode === ModeTypes.DETAIL ? 'center' : 'left',
    },
    {
      field: 'importoDovuto',
      headerName: 'Importo dovuto',
      type: mode === ModeTypes.DETAIL ? 'text' : 'input',
      align: mode === ModeTypes.DETAIL ? 'center' : 'left',
      sx: { width: '27%' },
    },
    {
      field: 'importoCorrisposto',
      headerName: 'Importo corrisposto',
      type: mode === ModeTypes.DETAIL ? 'text' : 'input',
      align: mode === ModeTypes.DETAIL ? 'center' : 'left',
      sx: { width: '27%' },
    },
    {
      field: 'stato',
      headerName: 'Stato',
      type: 'chip',
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
    </Grid>
  );
};

const TabellaTransazioni = React.memo(TabellaTransazioniComponent, (prevProps, nextProps) => {
  // Considero dinamiche le props: disabled
  return _.isEqual(prevProps.disabled, nextProps.disabled);
});
TabellaTransazioni.whyDidYouRender = true;

export default TabellaTransazioni;
