import * as React from 'react';
import { Box, Button, Stepper, Step, StepLabel } from '@mui/material';
import { useTheme } from '@mui/system';
import {
  Regola,
  validateSintassi,
  validateConflitti,
  equals,
} from '@model/regola';
import TargetStep from './TargetStep';
import ContextStep from './CondizioniStep';
import NumberRuleBuilder from './EspressioneStep';
import { ProcedimentoContext } from '@context/Procedimento';

// Steps
const steps = ['Target', 'Condizioni', 'Formula'];

export default function RuleBuilder({
  mode = 'create',
  rule,
  onError,
  onSuccess,
  onEndOperation,
  sx,
}) {
  // Style
  const theme = useTheme();

  // Context
  const { setRegole, regole } = React.useContext(ProcedimentoContext);

  // Steps
  const [activeStep, setActiveStep] = React.useState(0);
  const [regola, setRegola] = React.useState(() =>
    mode === 'modify' ? JSON.parse(JSON.stringify(rule)) : new Regola()
  );

  // Effects
  React.useEffect(() => {
    console.log('rule', rule);
    if (mode === 'modify' && rule) {
      setRegola(JSON.parse(JSON.stringify(rule)));
    }
  }, [mode, rule]);

  // Handlers
  const handleNext = () => setActiveStep((prevStep) => prevStep + 1);
  const handleBack = () => setActiveStep((prevStep) => prevStep - 1);
  const updateRegola = (dati) => {
    console.log('rule', rule);
    setRegola({ ...regola, ...dati });
    console.log('regola', { ...regola, ...dati });
  };
  const handleCreateRule = () => {
    //console.log('Inizio creazione regola', regola);

    // Step 1: Validazione sintattica della regola
    const sintassiResult = validateSintassi(regola);

    if (!sintassiResult.applicabile) {
      //console.log('Errore di sintassi nella regola', sintassiResult.messaggio);
      if (onError) onError(sintassiResult.messaggio);
      return;
    }

    //console.log('Regola sintatticamente valida', regola);

    // Step 2: Verifica conflitti con altre regole
    console.log('regola', regola);
    console.log('rule', rule);
    const conflittiResult = validateConflitti(regola, regole);

    if (!conflittiResult.applicabile) {
      console.log(
        'Conflitto rilevato con regole esistenti',
        conflittiResult.messaggio
      );
      if (onError) onError(conflittiResult.messaggio);
      return;
    } else {
      console.log('Regola applicabile', regola);
      setRegole([...regole, regola]);
      onSuccess('Regola creata con successo');
      if (onEndOperation) onEndOperation();
    }
  };
  const handleModifyRule = () => {
    const sintassiResult = validateSintassi(regola);

    if (!sintassiResult.applicabile) {
      if (onError) onError(sintassiResult.messaggio);
      return;
    }

    const regoleFiltered = regole.filter((r) => !equals(r, rule));
    console.log('regoleFiltered', regoleFiltered);
    const conflittiResult = validateConflitti(regola, regoleFiltered);

    if (conflittiResult && !conflittiResult.applicabile) {
      if (onError) onError(conflittiResult.messaggio);
      return;
    } else {
      setRegole([...regoleFiltered, regola]);
      onSuccess('Regola modificata con successo');
      if (onEndOperation) onEndOperation();
    }
  };

  return (
    <Box sx={{ width: '100%', height: '100%', ...sx }}>
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
          target={regola?.espressione?.target || null}
          onUpdate={updateRegola}
          mode={mode}
        />
      )}

      {/* Step contesto */}
      {activeStep === 1 && (
        <ContextStep
          condizioni={regola.condizioni}
          onUpdate={updateRegola}
          mode={mode}
        />
      )}

      {/* Step espressione numerica */}
      {activeStep === 2 && (
        <NumberRuleBuilder
          onUpdate={updateRegola}
          espressione={regola.espressione}
          mode={mode}
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
          onClick={
            activeStep === steps.length - 1
              ? mode === 'modify'
                ? handleModifyRule
                : handleCreateRule
              : handleNext
          }
        >
          {activeStep === steps.length - 1
            ? mode === 'modify'
              ? 'Modifica'
              : 'Crea'
            : 'Avanti'}
        </Button>
      </Box>
    </Box>
  );
}
