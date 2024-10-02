import * as React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import { Typography } from '@mui/material';
import TabellaParti from './TabellaParti.jsx';
import AggiungiParteButton from './AggiungiParteButton.jsx';
import CollegaParteButton from './CollegaParteButton.jsx';

function StepParti(props, ref){

    const formLabelFontSize = '1rem'
    
    return(
        <div style={{display: 'flex', flexDirection:'column', alignItems: 'center', justifyContent:'center', rowGap:'4rem', padding: '4.5rem 0'}}>
            {/* Lista delle parti */}
            <Grid xs={12}>
                <Grid xs={12} sx={{borderBottom:'1px solid #467bae61', margin: '0 0 0 1rem', width: 'calc(100% - 1rem)'}}><Typography sx={{fontWeight: '400', fontSize: formLabelFontSize, color: '#467bae'}}>Lista delle parti</Typography></Grid>
                <TabellaParti/>
                <div style={{margin: '0 0 0 1rem', width: 'calc(100% - 1rem)'}}>
                    <AggiungiParteButton sx={{marginRight: '10rem'}}/>
                    <CollegaParteButton/>
                </div>
            </Grid>
        </div>
    )

}

export default React.forwardRef(StepParti)