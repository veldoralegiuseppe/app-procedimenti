import * as React from 'react';
import { Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import Breadcrumbs from "@components/Breadcrumbs.jsx";
import Stepper from '@components/Stepper';
import { ProcedimentoContext } from '@src/store/procedimento-context.jsx';
import DatiGeneraliProcedimento from '@pages/DatiGeneraliProcedimento';
import { Procedimento } from '@model/procedimento.js';
import PartiControparti from '@pages/PartiControparti';

export default function CreaProcedimento(){

    const theme = useTheme()
    var [procedimento, setProcedimento] = React.useState(new Procedimento())
    const stepProcRef = React.useRef()

    const steps = [
        {label: 'Dati generali', component: <DatiGeneraliProcedimento procedimento={procedimento} ref={stepProcRef}/>}, 
        {label: 'Parti e controparti', component: <PartiControparti/>}, 
        {label: 'Riepilogo', component: 'Finale'}
    ];  

    
    return(
        <ProcedimentoContext.Provider value={{procedimento: [procedimento, setProcedimento], parti: {personeFisiche: []}}}>
            <div style={{display: 'flex', flexDirection: 'column', flex: '1', rowGap: '5rem'}}>
                <div style={{display: 'flex', backgroundColor: theme.palette.background.default, justifyContent: 'space-between', height: '56px', alignItems: 'center', padding: '0 16px', borderRadius: '8px'}}>
                    <Typography variant="h5" sx={{fontWeight: '400', fontSize: '1.4rem', color: theme.palette.text.primary}}>Crea Procedimento</Typography>
                    <Breadcrumbs></Breadcrumbs>
                </div>

                <Stepper steps={steps}></Stepper>
            </div>
        </ProcedimentoContext.Provider>
    )
}