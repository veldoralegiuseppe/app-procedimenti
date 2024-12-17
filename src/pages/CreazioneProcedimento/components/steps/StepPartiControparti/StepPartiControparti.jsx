import * as React from 'react';
import Grid from '@mui/material/Grid2';
import { TabellaPartiControparti } from '@features/persona';
import { FormModal, ButtonFactory, FormTitle } from '@shared/components';
import { ProcedimentoContext } from '@shared/context';
import { ButtonTypes } from '@shared/metadata';
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
  const formLabelFontSize = '1.2rem';
  const { persone, setPersone } = React.useContext(ProcedimentoContext);

  const onPersonaDelete = (personeToKeep) => {
    console.log(personeToKeep);
    const indicesToKeep = personeToKeep.map(
      (persona) => Number(persona.id) - 1
    );
    const updatedPersone = persone.filter((_, index) =>
      indicesToKeep.includes(index)
    );
    setPersone(updatedPersone);
  };

  return (
    <Grid container size={{ xs: 12 }} rowGap="3rem">
      {/* Tabella persone */}
      <Grid size={{ xs: 12 }}>
        <FormTitle title="Lista delle parti" />
        <TabellaPartiControparti onDelete={onPersonaDelete} />
      </Grid>

      <AggiungiParteButton sx={{ marginRight: '10rem' }} />
    </Grid>
  );
}

export default React.forwardRef(StepPartiControparti);
