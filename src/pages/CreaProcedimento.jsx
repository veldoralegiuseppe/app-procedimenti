import * as React from 'react';
import { Typography, Box, Backdrop } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { Breadcrumbs, Stepper } from '@shared/components';
import {
  StepDatiGeneraliProcedimento,
  StepPartiControparti,
  StepRiepilogoProcedimento,
} from '@pages';
import { RobotToolbar } from '@features/regola';

export default function CreaProcedimento() {
  const theme = useTheme();

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
            height: 'auto',
            padding: '0',
            borderRadius: '8px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              height: '56px',
              padding: '0',
            }}
          >
            <Typography
              variant="h4"
              sx={{
                color: theme.palette.text.primary,
                fontSize: '2rem',
                fontWeight: 700,
              }}
            >
              Nuovo Procedimento
            </Typography>
            <Breadcrumbs />
          </Box>
          <Typography
            variant="body1"
            sx={{ padding: '16px 0', fontSize: '1.1rem' }}
          >
            Completa i passaggi guidati inserendo le informazioni sulla
            mediazione, dati delle parti coinvolte e i dettagli del caso. Al
            termine, verifica i dati e conferma per finalizzare il nuovo
            procedimento.
          </Typography>
        </div>

        <Stepper steps={steps} />
        <RobotToolbar />
      </div>
    </React.Fragment>
  );
}
