import * as React from 'react';
import Breadcrumbs from "/src/components/breadcrumbs/Breadcrumbs.jsx";
import { Typography } from '@mui/material';
import HorizontalLinearStepper from '/src/components/stepper/Stepper.jsx';
import { useTheme } from '@mui/material/styles';
import { ProcedimentoContext } from '/src/store/procedimento-context.jsx';
import StepProcedimento from './StepProcedimento.jsx';
import { Procedimento } from '/src/vo/procedimento.js';

export default function CreaProcedimento(){

    const theme = useTheme()
    var [procedimento, setProcedimento] = React.useState(new Procedimento())
    const stepProcRef = React.useRef()

    const steps = [
        {label: 'Definisci il procedimento', component: <StepProcedimento procedimento={procedimento} ref={stepProcRef}/>}, 
        {label: 'Definisci le parti', component: 'Definisci parti'}, 
        {label: 'Riepilogo', component: 'Finale'}
    ];  

    

    return(
        <ProcedimentoContext.Provider value={[procedimento, setProcedimento]}>
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


