import * as React from 'react';
import { Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import Breadcrumbs from "@components/Breadcrumbs.jsx";
import Stepper from '@components/Stepper';
import { ProcedimentoProvider } from '@context/Procedimento';
import DatiGeneraliProcedimento from '@pages/DatiGeneraliProcedimento';
import PartiControparti from '@pages/PartiControparti';
import RiepilogoProcedimento from '@pages/RiepilogoProcedimento';

export default function CreaProcedimento() {

    const theme = useTheme();
    const stepProcRef = React.useRef();
    
    const steps = [
        {label: 'Dati generali', component: <DatiGeneraliProcedimento/>}, 
        {label: 'Parti e controparti', component: <PartiControparti/>}, 
        {label: 'Riepilogo', component: <RiepilogoProcedimento/>}
    ];  

    return (
        <ProcedimentoProvider>
            <div style={{display: 'flex', flexDirection: 'column', flex: '1', rowGap: '5rem'}}>
                <div style={{display: 'flex', backgroundColor: theme.palette.background.default, justifyContent: 'space-between', height: '56px', alignItems: 'center', padding: '0 16px', borderRadius: '8px'}}>
                    <Typography variant="h5" sx={{fontSize: '1.4rem', color: theme.palette.text.primary}}>
                        Crea Procedimento
                    </Typography>
                    <Breadcrumbs />
                </div>
                <Stepper steps={steps} />
            </div>
        </ProcedimentoProvider>
    );
}
