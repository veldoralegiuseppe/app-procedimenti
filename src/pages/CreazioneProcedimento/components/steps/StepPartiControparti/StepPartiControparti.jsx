import * as React from 'react';
import Grid from '@mui/material/Grid2';
import { TabellaPartiControparti } from '@features/persona';
import { FormModal, ButtonFactory, FormTitle } from '@shared/components';
import { useStoreContext } from '@shared/context';
import { usePersoneStore } from '@features/persona';
import { ButtonTypes, FieldTypes } from '@shared/metadata';
import FormParteControparte from './components/FormParteControparte/FormParteControparte';

function AggiungiParteButton(props) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div style={{ display: 'inline-block', ...props.sx }}>
      <ButtonFactory
        onClick={handleOpen}
        text="Aggiungi"
        size="small"
        type={ButtonTypes.CREATE}
      />

      <FormModal
        title="Aggiungi parte/controparte"
        open={open}
        handleClose={handleClose}
      >
        <FormParteControparte />
      </FormModal>
    </div>
  );
}

function StepPartiControparti(props, ref) {
  const [selectedRowIndices, setSelectedRowIndices] = React.useState([]);
  const personeStore = useStoreContext(FieldTypes.PERSONE);
  const {removeItem} = usePersoneStore(personeStore)

  const handleRowSelected = React.useCallback((indices) => {
    setSelectedRowIndices([...indices]);
  }, []);

  const handleDelete = React.useCallback(() => {
    console.log('selectedRowIndices', selectedRowIndices);
    selectedRowIndices.forEach((index) => {
      removeItem(index);
    });
    setSelectedRowIndices([]);
  }, [selectedRowIndices, removeItem, personeStore]);

  return (
    <Grid container size={{ xs: 12 }} rowGap="3rem">
      {/* Tabella persone */}
      <Grid size={{ xs: 12 }}>
        <FormTitle title="Lista delle parti" />
        <TabellaPartiControparti onRowSelected={handleRowSelected} />
      </Grid>

      <AggiungiParteButton sx={{ marginRight: '1rem' }} />
      <ButtonFactory type={ButtonTypes.DELETE} text="Elimina" size='small' disabled={!selectedRowIndices.length > 0} onClick={handleDelete} />
    </Grid>
  );
}

export default React.forwardRef(StepPartiControparti);
