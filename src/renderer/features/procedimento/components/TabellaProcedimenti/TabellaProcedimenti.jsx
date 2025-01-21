import * as React from 'react';
import {
  TableFactory,
  ButtonFactory,
  FormModal,
  ModelFactory,
} from '@ui-shared/components';
import { useModelArrayStore } from '@ui-shared/hooks';
import { styled } from '@mui/system';
import { TableCell, TableHead } from '@mui/material';
import EuroIcon from '@mui/icons-material/Euro';
import { ButtonTypes, FieldTypes } from '@ui-shared/metadata';
import { ModelTypes } from '@shared/metadata';
import { useStoreContext } from '@ui-shared/context';
import { useProcedimentoStore } from '@features/procedimento';
import { usePersoneStore } from '@features/persona';
import RiepilogoSpese from './components/RiepilogoSpese/RiepilogoSpese';
import useProcedimentoTableRow from './hooks/useProcedimentoTableRow';
import _ from 'lodash';

const AzioniCell = (onClick) => (props) => {
  //console.log('props', props);

  const { getItem } = useModelArrayStore(props.store);
  const procedimento = React.useMemo(
    () => getItem(props.rowId),
    [getItem, props.rowId]
  );

  const handleClick = () => {
    console.log('Click su modifica procedimento');
    onClick?.(procedimento?.id);
  };

  return (
    <ButtonFactory
      type={ButtonTypes.ICON}
      text={<EuroIcon />}
      onClick={handleClick}
    />
  );
};

const TabellaProcedimenti = ({ onRowSelected, procedimenti = [] }) => {
  const { data } = useProcedimentoTableRow({ procedimenti });
  const stores = useStoreContext();
  const { resetModel } = useProcedimentoStore(stores[ModelTypes.PROCEDIMENTO]);
  const { resetItems } = usePersoneStore(stores[FieldTypes.PERSONE]);

  const [open, setOpen] = React.useState(false);
  const [procedimentoSelezionato, setProcedimentoSelezionato] =
    React.useState(null);

  const loadProcedimento = (procedimento) => {
    console.log('Caricamento procedimento', procedimento);

    const persone = procedimento?.persone
      ? procedimento?.persone?.map((p) =>
          ModelFactory.create({
            initialValues: p,
            type: p.type,
            version: p.version,
          })
        )
      : [];

    const istanza = ModelFactory.create({
      initialValues: procedimento,
      type: ModelTypes.PROCEDIMENTO,
      version: procedimento.version,
    });

    resetModel(istanza);
    resetItems(persone);

    return istanza;
  };

  const handleSpeseClick = (index) => {
    const procedimento = loadProcedimento(procedimenti[index]);
    setProcedimentoSelezionato(procedimento);
    _.delay(() => setOpen(true), 10);
  };

  const handleCloseModale = (onClose) => {
    onClose?.();
    setOpen(false);
  }

  const columns = [
    {
      field: 'numProtocollo',
      headerName: 'Procedimento',
      sortable: true,
      sx: { paddingLeft: '1rem' },
      align: 'center',
    },
    {
      field: 'dataDeposito',
      headerName: 'Data deposito',
      sortable: true,
      sx: { paddingLeft: '1rem' },
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
      field: 'mediatore',
      headerName: 'Mediatore',
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
      field: 'azioni',
      headerName: '',
      sortable: false,
      type: 'custom',
      render: AzioniCell(handleSpeseClick),
      align: 'center',
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
    // selectableConfig: {
    //   isMultiSelect: false,
    //   onSelected: (selezionati) => {
    //     onRowSelected?.(selezionati);
    //   },
    // },
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
    <React.Fragment>
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

      <FormModal open={open} handleClose={handleCloseModale}>
        <RiepilogoSpese open={open} procedimento={procedimentoSelezionato} />
      </FormModal>
    </React.Fragment>
  );
};

export default TabellaProcedimenti;
