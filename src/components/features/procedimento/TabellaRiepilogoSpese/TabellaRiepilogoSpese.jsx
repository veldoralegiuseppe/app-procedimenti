import * as React from 'react';
import { styled } from '@mui/system';
import { TableCell, TableHead } from '@mui/material';
import ImportoInput from '@components/ImportoInput';
import ImportoReadOnly from '@components/ImportoReadOnly';
import TableFactory from '@components/factories/TableFactory/TableFactory';
import TransazioneCellRender from './components/TransazioneCellRender';

const columns = [
  {
    field: 'transazione',
    type: 'custom',
    render: TransazioneCellRender,
    headerName: 'Transazione',
  },
  {
    field: 'importo',
    headerName: 'Importo',
    type: 'input',
    sx: { width: '35%', minWidth: '180px' },
  },
  { field: 'stato', headerName: 'Stato', type: 'chip', sx: { width: '20%' } },
];

const data = [
  {
    transazione: { tipo: 'entrata', nome: 'Incasso parti' },
    importo: { component: ImportoReadOnly, value: 0, backgroundColor: '#cacaca29' },
    stato: { value: 'DA SALDARE', status: 'error' },
  },
  {
    transazione: { tipo: 'entrata', nome: 'Incasso controparti' },
    importo: { component: ImportoReadOnly, value: 0, backgroundColor: '#cacaca29'},
    stato: { value: 'DA SALDARE', status: 'error' },
  },
  {
    transazione: { tipo: 'uscita', nome: 'Compenso mediatore' },
    importo: { component: ImportoInput, value: 0 },
    stato: { value: 'DA SALDARE', status: 'error' },
  },
  {
    transazione: { tipo: 'uscita', nome: 'Spese avvio sede secondaria' },
    importo: { component: ImportoInput, value: 0 },
    stato: { value: 'DA SALDARE', status: 'error' },
  },
  {
    transazione: { tipo: 'uscita', nome: 'Spese indennità sede secondari' },
    importo: { component: ImportoInput, value: 0 },
    stato: { value: 'DA SALDARE', status: 'error' },
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

const TabellaRiepilogoSpese = (props) => {
  return (
    <TableFactory
      columns={columns}
      data={data}
      headerConfig={headerConfig}
      rowConfig={{ sx: { '& td': { padding: '6px 4px' } } }}
      sx={{ '& table': { tableLayout: 'fixed', width: '100%' } }}
    />
  );
};

export default TabellaRiepilogoSpese;
