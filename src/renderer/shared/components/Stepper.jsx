import * as React from 'react';
import {
  Stepper as MuiStepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Box,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid2';

export default function Stepper({ steps, onSubmit, reset, onReset }) {
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const [disableNext, setDisableNext] = React.useState(true);
  const theme = useTheme();
  const stepRef = React.useRef(null);

  React.useEffect(() => {
    if (reset) {
      setActiveStep(0);
      setSkipped(new Set());
      onReset?.()
    }
  }, [reset]);


  React.useEffect(() => {
    const currentStepComponent = steps[activeStep].component;

    if (currentStepComponent && stepRef.current?.validate) {
      console.log('chiamo validate');
      setDisableNext(!stepRef.current.validate());
    } else {
      setDisableNext(false);
    }
  }, [activeStep, steps]);

  const enableNextStep = React.useCallback((isEnabled) => {
    setDisableNext(!isEnabled);
  }, []);

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

  const handleBack = () =>
    setActiveStep((prevActiveStep) => prevActiveStep - 1);

  const handleReset = () => setActiveStep(0);

  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: theme.palette.background.default,
        borderRadius: '8px',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column', // Stepper and content centered
        gap: '4rem', // Space between stepper and form below
      }}
    >
      {/* Stepper Container with background */}
      <Box
        sx={{
          width: '100%',
          maxWidth: '100rem', // Limit the max width for better centering
          backgroundColor: 'transparent', // Background color for the stepper
          display: 'flex',
          justifyContent: 'center', // Center the stepper horizontally
          alignItems: 'center',
        }}
      >
        <MuiStepper
          activeStep={activeStep}
          alternativeLabel
          sx={{
            width: '100%', // Let the stepper take full width inside the container
            paddingBottom: '2rem',
            '& .MuiStepConnector-line': {
              borderColor: '#c96b00d4', // Line color between steps
            },
          }}
        >
          {steps.map((step, index) => {
            const stepProps = {};
            const labelProps = {};
            if (isStepSkipped(index)) stepProps.completed = false;

            return (
              <Step key={step.label} {...stepProps}>
                <StepLabel
                  {...labelProps}
                  sx={{
                    '& .MuiStepLabel-label': {
                      fontSize: '1rem', // Step label font size
                      fontWeight: '400', // Ensure font weight is 400 for all step labels
                    },
                    '& .MuiStepLabel-label.Mui-active, & .MuiStepLabel-label.Mui-completed':
                      {
                        color: '#ED9747', // Color for active/completed step labels
                      },
                    '& .MuiStepIcon-root': {
                      width: '2.5rem', // Enlarged step icons
                      height: '2.5rem',
                      fontSize: '1.8rem', // Enlarged step numbers
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',

                      // Background for active/completed steps
                      backgroundColor:
                        activeStep > index
                          ? theme.palette.primary.main
                          : 'transparent',
                      color: activeStep > index ? '#ffffff' : '#b0b0b0', // Default color for completed steps

                      // Change text color to white for active and "to-do" steps
                      '& .MuiStepIcon-text': {
                        fill:
                          activeStep === index || activeStep < index
                            ? '#ffffff'
                            : undefined, // White for active and to-do steps
                      },
                    },
                    '& .MuiStepIcon-root.Mui-completed .MuiStepIcon-text': {
                      color: '#ED9747', // Keep the default color when step is completed
                    },
                  }}
                >
                  {step.label}
                </StepLabel>
              </Step>
            );
          })}
        </MuiStepper>
      </Box>

      {/* Main content (form) below the stepper */}
      <div
        id="stepper-content-container"
        style={{
          display: 'flex',
          flexDirection: 'column',
          rowGap: '0',
          width: '100%',
          borderRadius: '12px',
          border: '1px solid rgb(198, 196, 193 / 80%)',
          padding: '4rem 2rem',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.25)',
        }}
      >
        {activeStep === steps.length ? (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>
              All steps completed - you're finished
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button onClick={handleReset}>Reset</Button>
            </Box>
          </React.Fragment>
        ) : (
          <React.Fragment>
            {/* Add the current step component */}
            {React.cloneElement(steps[activeStep].component, {
              ref: stepRef,
              enableNextStep,
            })}
          </React.Fragment>
        )}
      </div>

      {/* Control buttons */}
      <Grid
        size={{ xs: 12 }}
        sx={{ borderTop: '1px solid rgba(198, 196, 193, 0.8)' }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            pt: 3,
            justifyContent: 'space-around',
            alignItems: 'center',
          }}
        >
          <Button
            color="inherit"
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
          <Box sx={{ flex: '1 1 auto' }} />
          <Button
            onClick={() => activeStep === steps.length - 1 ? onSubmit() : handleNext()}
            disabled={disableNext}
            sx={{
              '&.Mui-disabled': {
                backgroundColor: '#f4f4f4',
                color: theme.palette.text.disabled,
              },
              backgroundColor: theme.palette.primary.light,
              color: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: theme.palette.primary.light,
                color: theme.palette.primary.main,
              },
            }}
          >
            {activeStep === steps.length - 1 ? 'Crea' : 'Avanti'}
          </Button>
        </Box>
      </Grid>
    </Box>
  );
}
