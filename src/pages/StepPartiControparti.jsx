import * as React from 'react';
import Grid from '@mui/material/Grid2';
import { Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import TabellaPartiControparti from '@components/TabellaPartiControparti';
import CreaParteControparte from '@pages/CreaParteControparte';
import FormModal from '@components/FormModal';
import { ProcedimentoContext } from '@context/Procedimento';

function AggiungiParteButton(props) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const buttonColor = '#467bae';
  const buttonHoverColor = '#7cb8f2';

  return (
    <div style={{ display: 'inline-block', ...props.sx }}>
      <Button
        onClick={handleOpen}
        variant="text"
        sx={{
          color: buttonColor,
          '&:hover, &:hover svg': {
            backgroundColor: 'unset',
            color: buttonHoverColor,
          },
        }}
        startIcon={
          <AddIcon
            sx={{
              color: buttonColor,
              transition: 'color 250ms',
            }}
          />
        }
      >
        Crea nuova parte
      </Button>
      {/* Modal separato per gestire la creazione */}
      <FormModal
        title="Aggiungi parte/controparte"
        open={open}
        handleClose={handleClose}
      >
        <CreaParteControparte />
      </FormModal>
    </div>
  );
}

function StepPartiControparti(props, ref) {
  const formLabelFontSize = '1.2rem';
  const { persone, setPersone } = React.useContext(ProcedimentoContext);

  const onPersonaDelete = (personeToKeep) => {
    console.log(personeToKeep)
    const indicesToKeep = personeToKeep.map(persona => Number(persona.id) - 1)
    const updatedPersone = persone.filter((_, index) => indicesToKeep.includes(index));
    setPersone(updatedPersone);
  };

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        rowGap: '4rem',
      }}
    >
      {/* Lista delle parti */}
      <Grid size={{ xs: 12 }}>
        <Grid
          size={{ xs: 12 }}
          sx={{ marginBottom: '1rem', borderBottom: '1px solid #467bae' }}
        >
          <Typography
            sx={{ fontSize: formLabelFontSize, color: '#467bae', margin: '0' }}
          >
            Lista delle parti
          </Typography>
        </Grid>
        <TabellaPartiControparti onDelete={onPersonaDelete} />
        <div style={{ margin: '0 0 0 1rem', width: 'calc(100% - 1rem)' }}>
          <AggiungiParteButton sx={{ marginRight: '10rem' }} />
          {/* <CollegaParteButton/> */}
        </div>
      </Grid>
    </div>
  );
}

export default React.forwardRef(StepPartiControparti);
