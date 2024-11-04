import * as React from 'react';
import {
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { useTheme } from '@mui/system';
import { Regola, validateRegola } from '@model/regola';
import TargetStep from './TargetStep';
import ContextStep from './CondizioniStep';
import NumberRuleBuilder from './EspressioneStep';
import { ProcedimentoContext } from '@context/Procedimento';

// Steps
const steps = ['Target', 'Condizioni', 'Formula'];

export default function RuleBuilder({ type = 'number' }) {
  // Style
  const theme = useTheme();

  // Context
  const { notify, setRegole } = React.useContext(ProcedimentoContext);

  // Steps
  const [activeStep, setActiveStep] = React.useState(0);
  const [regola, setRegola] = React.useState(new Regola());

  // Handlers
  const handleNext = () => setActiveStep((prevStep) => prevStep + 1);
  const handleBack = () => setActiveStep((prevStep) => prevStep - 1);
  const updateRegola = (dati) => {
    setRegola({ ...regola, ...dati });
    console.log('regola', { ...regola, ...dati });
  };
  const handleCreateRule = () => {
    console.log('regola', regola);
    const {messaggio, applicabile} = validateRegola(regola);

    if (applicabile) {
      console.log('Regola creata con successo', regola);
    } else {
      notify(messaggio, 'error');
    }
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Step target */}
      {activeStep === 0 && (
        <TargetStep
          target={regola.target || null}
          type={regola.target || type}
          onUpdate={updateRegola}
        />
      )}

      {/* Step contesto */}
      {activeStep === 1 && (
        <ContextStep condizioni={regola.condizioni} onUpdate={updateRegola} />
      )}

      {/* Step espressione numerica */}
      {activeStep === 2 && (
        <NumberRuleBuilder
          onUpdate={updateRegola}
          espressione={regola.espressione}
        />
      )}

      {/* Stepper button */}
      <Box
        sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}
      >
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          sx={{
            '&.Mui-disabled': {
              backgroundColor: 'unset',
              border: `.9px solid rgb(199 199 199 / 60%)`,
              color: theme.palette.text.disabled,
            },
            backgroundColor: 'unset',
            border: `.9px solid ${theme.palette.logo.primary}`,
            color: theme.palette.logo.primary,
            '&:hover': { backgroundColor: '#6ea5da29' },
          }}
        >
          Indietro
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={activeStep === steps.length - 1 ? handleCreateRule : handleNext}
        >
          {activeStep === steps.length - 1 ? 'Applica' : 'Avanti'}
        </Button>
      </Box>
    </Box>
  );
}
