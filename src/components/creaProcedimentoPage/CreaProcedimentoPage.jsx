import * as React from 'react';
import Breadcrumbs from "/src/components/breadcrumbs/Breadcrumbs.jsx";
import { Typography } from '@mui/material';
import HorizontalLinearStepper from '/src/components/stepper/Stepper.jsx';
import { useTheme } from '@mui/material/styles';
import { ProcedimentoContext } from '/src/store/procedimento-context.jsx';
import StepProcedimento from './StepProcedimento.jsx';
import { Procedimento } from '/src/vo/procedimento.js';

export default function CreaProcedimento(){

    const steps = [
        {label: 'Definisci il procedimento', component: <StepProcedimento/>}, 
        {label: 'Definisci le parti', component: 'Definisci parti'}, 
        {label: 'Riepilogo', component: 'Finale'}
    ];  

    const theme = useTheme()

    return(
        <ProcedimentoContext.Provider value={{procedimento: new Procedimento()}}>
            <div style={{display: 'flex', flexDirection: 'column', flex: '1', rowGap: '5rem'}}>
                <div style={{display: 'flex', backgroundColor: theme.palette.background.default, justifyContent: 'space-between', height: '56px', alignItems: 'center', padding: '0 16px', borderRadius: '8px'}}>
                    <Typography variant="h5" sx={{fontWeight: '400', fontSize: '1.4rem', color: theme.palette.text.primary}}>Crea Procedimento</Typography>
                    <Breadcrumbs></Breadcrumbs>
                </div>

                <HorizontalLinearStepper steps={steps}></HorizontalLinearStepper>
            </div>
        </ProcedimentoContext.Provider>
    )
}


