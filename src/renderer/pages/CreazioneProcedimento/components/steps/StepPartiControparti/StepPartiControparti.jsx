import * as React from 'react';
import Grid from '@mui/material/Grid2';
import { Box } from '@mui/material';
import { TabellaPartiControparti } from '@features/persona';
import { FormModal, ButtonFactory, FormTitle } from '@shared/components';
import { ButtonTypes, ModeTypes } from '@shared/metadata';
import usePartiControparti from './hooks/usePartiControparti';
import FormParteControparte from './components/FormParteControparte/FormParteControparte';

function StepPartiControparti(props, ref) {
  const {
    isModalOpen,
    selectedRows,
    openModal,
    closeModal,
    handleRowSelection,
    deleteSelectedRows,
    handleChanges,
  } = usePartiControparti();

  return (
    <Grid container size={{ xs: 12 }} rowGap="3rem">
      {/* Tabella persone */}
      <Grid size={{ xs: 12 }}>
        <FormTitle title="Lista delle parti" />
        <TabellaPartiControparti onRowSelected={handleRowSelection} />
      </Grid>

      {/* Azioni */}
      <Box style={{ display: 'inline-flex', columnGap: '2rem' }}>
        <ButtonFactory
          onClick={() => openModal(ModeTypes.CREATE)}
          text="Aggiungi"
          size="small"
          type={ButtonTypes.CREATE}
        />

        <ButtonFactory
          type={ButtonTypes.MODIFY}
          text="Modifica"
          size="small"
          disabled={!selectedRows.length > 0}
          onClick={() => openModal(ModeTypes.MODIFY)}
        />

        <ButtonFactory
          type={ButtonTypes.DELETE}
          text="Elimina"
          size="small"
          disabled={!selectedRows.length > 0}
          onClick={deleteSelectedRows}
        />
      </Box>

      {/* Modale */}
      <FormModal
        title="Aggiungi parte/controparte"
        open={isModalOpen}
        handleClose={closeModal}
      >
        <FormParteControparte onSubmit={handleChanges} />
      </FormModal>
    </Grid>
  );
}

export default React.forwardRef(StepPartiControparti);
