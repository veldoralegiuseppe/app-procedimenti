import * as React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import { Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import TabellaPartiControparti from '@components/TabellaPartiControparti';
import CreaParteControparte from '@pages/CreaParteControparte';
import FormModal from '@components/FormModal';

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
        <FormModal title='Aggiungi parte/controparte' open={open} handleClose={handleClose}>
            <CreaParteControparte/>
        </FormModal>
      </div>
    );
}

function PartiControparti(props, ref){

    const formLabelFontSize = '1rem'
    
    return(
        <div style={{display: 'flex', flexDirection:'column', alignItems: 'center', justifyContent:'center', rowGap:'4rem', padding: '4.5rem 0'}}>
            {/* Lista delle parti */}
            <Grid xs={12}>
                <Grid xs={12} sx={{borderBottom:'1px solid #467bae61', margin: '0 0 0 1rem', width: 'calc(100% - 1rem)'}}><Typography sx={{fontWeight: '400', fontSize: formLabelFontSize, color: '#467bae'}}>Lista delle parti</Typography></Grid>
                <TabellaPartiControparti/>
                <div style={{margin: '0 0 0 1rem', width: 'calc(100% - 1rem)'}}>
                    <AggiungiParteButton sx={{marginRight: '10rem'}}/>
                    {/* <CollegaParteButton/> */}
                </div>
            </Grid>
        </div>
    )

}

export default React.forwardRef(PartiControparti)