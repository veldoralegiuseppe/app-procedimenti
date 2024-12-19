import * as React from 'react';
import Grid from '@mui/material/Grid2';
import { Box } from '@mui/material';
import { TabellaPartiControparti } from '@features/persona';
import { FormModal, ButtonFactory, FormTitle } from '@shared/components';
import { ButtonTypes } from '@shared/metadata';
import usePartiControparti from './hooks/usePartiControparti';
import FormParteControparte from './components/FormParteControparte/FormParteControparte';

function StepPartiControparti(props, ref) {
  const {
    open,
    selectedRowIndices,
    handleOpenCreation,
    handleOpenModify,
    handleClose,
    handleRowSelected,
    handleDelete,
    handleChanges,
  } = usePartiControparti();

  return (
    <Grid container size={{ xs: 12 }} rowGap="3rem">
      {/* Tabella persone */}
      <Grid size={{ xs: 12 }}>
        <FormTitle title="Lista delle parti" />
        <TabellaPartiControparti onRowSelected={handleRowSelected} />
      </Grid>

      {/* Azioni */}
      <Box style={{ display: 'inline-flex', columnGap: '2rem' }}>
        <ButtonFactory
          onClick={handleOpenCreation}
          text="Aggiungi"
          size="small"
          type={ButtonTypes.CREATE}
        />

        <ButtonFactory
          type={ButtonTypes.MODIFY}
          text="Modifica"
          size="small"
          disabled={!selectedRowIndices.length > 0}
          onClick={handleOpenModify}
        />

        <ButtonFactory
          type={ButtonTypes.DELETE}
          text="Elimina"
          size="small"
          disabled={!selectedRowIndices.length > 0}
          onClick={handleDelete}
        />
      </Box>

      {/* Modale */}
      <FormModal
        title="Aggiungi parte/controparte"
        open={open}
        handleClose={handleClose}
      >
        <FormParteControparte onSubmit={handleChanges} />
      </FormModal>
    </Grid>
  );
}

export default React.forwardRef(StepPartiControparti);
