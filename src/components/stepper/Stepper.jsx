import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';

export default function HorizontalLinearStepper({ steps }) {
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const [disableNext, setDisableNext] = React.useState(true); // Modificato per essere gestito in modo sicuro
  const theme = useTheme();
  const stepRef = React.useRef(null); // Ref per il componente attivo

  // Effettua la validazione quando l'activeStep cambia
  React.useEffect(() => {
    // Cerca di accedere al ref del componente attivo, se esiste
    const currentStepComponent = steps[activeStep].component;

    if (currentStepComponent && stepRef.current?.validate) {
      // Verifica se la funzione validate esiste
      setDisableNext(!stepRef.current.validate());
    } else {
      setDisableNext(false); // Se non c'è validazione, abilita il pulsante Next
    }
  }, [activeStep, steps]);

  const isStepSkipped = (step) => skipped.has(step);

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);

  const handleReset = () => setActiveStep(0);

  return (
    <Box sx={{ width: '100%', backgroundColor: theme.palette.background.default, borderRadius: '8px', padding: '16px 16px', alignItems: 'center' }}>
      <Stepper activeStep={activeStep} sx={{ paddingBottom: '2rem', borderBottom: '1px solid #f1f1f1' }}>
        {steps.map((step, index) => {
          const stepProps = {};
          const labelProps = {};
          if (isStepSkipped(index)) stepProps.completed = false;

          return (
            <Step key={step.label} {...stepProps}>
              <StepLabel {...labelProps} sx={{
                '& .MuiStepLabel-label': { fontSize: '.9rem', fontWeight: '400' },
                '& .MuiStepLabel-label.Mui-active, & .MuiStepLabel-label.Mui-completed': { color: theme.palette.primary.main, fontWeight: '400' },
                '& .MuiSvgIcon-root': { width: '2rem', height: '2rem' }
              }}>
                {step.label}
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>

      <div style={{ display: 'flex', flexDirection: 'column', rowGap: '0' }}>
        {activeStep === steps.length ? (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>All steps completed - you're finished</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button onClick={handleReset}>Reset</Button>
            </Box>
          </React.Fragment>
        ) : (
          <React.Fragment>
            {/* Aggiungi il componente dello step attuale */}
            {React.cloneElement(steps[activeStep].component, { ref: stepRef })}

            {/* Button di controllo */}
            <Grid xs={12} sx={{ borderTop: '1px solid #f1f1f1' }}>
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2, justifyContent: 'space-around', alignItems: 'center' }}>
                <Button
                  color="inherit"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{
                    '&.Mui-disabled': {
                      backgroundColor: 'unset',
                      border: `.9px solid rgb(199 199 199 / 60%)`,
                      color: theme.palette.text.disabled,
                      fontWeight: '400'
                    },
                    backgroundColor: 'unset',
                    border: `.9px solid ${theme.palette.logo.primary}`,
                    color: theme.palette.logo.primary,
                    '&:hover': { backgroundColor: '#6ea5da29' }
                  }}>
                  Indietro
                </Button>
                <Box sx={{ flex: '1 1 auto' }} />
                <Button
                  onClick={handleNext}
                  disabled={disableNext}
                  sx={{
                    '&.Mui-disabled': { backgroundColor: '#f4f4f4', color: theme.palette.text.disabled, fontWeight: '400' },
                    backgroundColor: theme.palette.primary.light,
                    color: theme.palette.primary.main,
                    '&:hover': { backgroundColor: theme.palette.primary.light, color: theme.palette.primary.main }
                  }}>
                  {activeStep === steps.length - 1 ? 'Crea' : 'Avanti'}
                </Button>
              </Box>
            </Grid>
          </React.Fragment>
        )}
      </div>
    </Box>
  );
}
