import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Stepper, PageHeader } from '@ui-shared/components';
import StepDatiGeneraliProcedimento from './components/steps/StepDatiGenerali/StepDatiGeneraliProcedimento';
import StepPartiControparti from './components/steps/StepPartiControparti/StepPartiControparti';
import StepRiepilogoProcedimento from './components/steps/StepRiepilogo/StepRiepilogoProcedimento';

const CreaProcedimento = () => {
  const theme = useTheme();
  const helperText = `Completa i passaggi guidati inserendo le informazioni sulla
            mediazione, dati delle parti coinvolte e i dettagli del caso. Al
            termine, verifica i dati e conferma per finalizzare il nuovo
            procedimento.`;

  const steps = [
    { label: 'Dati generali', component: <StepDatiGeneraliProcedimento /> },
    { label: 'Parti e controparti', component: <StepPartiControparti /> },
    { label: 'Riepilogo', component: <StepRiepilogoProcedimento /> },
  ];

  return (
    <React.Fragment>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: '1',
          rowGap: '5rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            backgroundColor: theme.palette.background.default,
            flexDirection: 'column',
            rowGap: '1.5rem',
            height: 'auto',
            padding: '0',
            borderRadius: '8px',
          }}
        >
          <PageHeader title="Crea procedimento" helperText={helperText} />
          <Stepper steps={steps} />
        </div>
      </div>
    </React.Fragment>
  );
};

export default React.memo(CreaProcedimento);
