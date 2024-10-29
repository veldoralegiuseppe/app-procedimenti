import React, { useState } from 'react';
import {
  Autocomplete,
  Typography,
  Box,
  Chip,
  Button,
  Paper,
  Popper,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { styled, useTheme } from '@mui/system';
import { CssTextField, labelColor } from '@theme/MainTheme';

const StyledPopper = styled((props) => <Popper {...props} />)(({ theme }) => ({
  '& .MuiPaper-root': {
    backgroundColor: theme.palette.dropdown.primary,
    maxHeight: '200px',
    overflowY: 'auto',
  },
  '& .MuiMenuItem-root': {
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.dropdown.primary,
    '&:hover': {
      backgroundColor: theme.palette.dropdown.hover,
      color: theme.palette.primary.main,
    },
    '&.Mui-selected': {
      backgroundColor: '#cc6b00', // Colore di sfondo per l'opzione selezionata
      color: '#ffffff', // Colore del testo dell'opzione selezionata
    },
    '&.Mui-selected:hover': {
      backgroundColor: '#b35900', // Colore di hover per l'opzione selezionata
      color: '#ffffff',
    },
  },
}));

const steps = ['Definisci il contesto', "Costruisci l'espressione numerica"];

// Mock del modello del procedimento con soggetti, predicati e valori già definiti
const procedureModel = {
  'Tipo di Controversia': {
    key: 'Tipo di Controversia',
    type: 'testuale',
    sezione: 'Dati generali',
    value: 'Contratto',
  },
  'Data di Mediazione': {
    key: 'Data di Mediazione',
    type: 'data',
    sezione: 'Dati generali',
    value: '01/01/2024',
  },
  'Spese Postali': {
    key: 'Spese Postali',
    type: 'numerico',
    sezione: 'Parti istanti',
    value: '200',
  },
};

const numericVariables = [
  { key: 'Valore della controversia', sezione: 'Dati generali', value: 10 },
  { key: 'Incasso dalle parti', sezione: 'Parti', value: 5 },
  { key: 'Incasso dalle controparti', sezione: 'Controparti', value: 20 },
  { key: 'Somma spese avvio', sezione: 'Parti', value: 20 },
  { key: 'Somma spese avvio', sezione: 'Controparti', value: 20 },
].sort((a, b) => a.sezione.localeCompare(b.sezione));

// Predicati basati sul tipo del soggetto
const predicatiNumerici = ['è maggiore di', 'è minore di', 'è uguale a'];
const predicatiTestuali = ['è uguale a', 'contiene', 'non contiene'];
const predicatiData = ['è maggiore di', 'è minore di', 'è uguale a'];
const operators = ['+', '-', '*', '/', '.', 'Canc'];
const subjects = Object.values(procedureModel);

export default function RuleBuilder() {
  const formLabelColor = '#467bae';
  const [activeStep, setActiveStep] = useState(0); // Passaggio attivo nello stepper
  const [selectedSubjects, setSelectedSubjects] = useState([]); // Soggetti selezionati
  const [predicates, setPredicates] = useState({}); // Predicati per ogni soggetto
  const [expression, setExpression] = useState([]); // Componenti dell'espressione (operazioni e variabili)
  const [selectedVariables, setSelectedVariables] = useState([]); // Variabili numeriche selezionate
  const [preview, setPreview] = useState(''); // Espressione numerica in anteprima
  const theme = useTheme();
  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState('');

  // Handler
  const handleNext = () => setActiveStep((prevStep) => prevStep + 1);
  const handleBack = () => setActiveStep((prevStep) => prevStep - 1);

  const filteredSubjects = subjects.filter(
    (subject) =>
      !selectedSubjects.some((selected) => selected.key === subject.key)
  );

  const filteredVariables = numericVariables.filter(
    (variable) =>
      !selectedVariables.some((selected) => selected.key === variable.key)
  );

  const handleSubjectSelect = (event, newSelectedSubjects) => {
    setSelectedSubjects(newSelectedSubjects);
    const newRules = newSelectedSubjects.map((subject) => {
      const { key, value } = subject;
      return {
        subject: key,
        predicate: '',
        value,
      };
    });
  };

  const handlePredicateChange = (subject, selectedPredicate) => {
    setPredicates({
      ...predicates,
      [subject]: selectedPredicate,
    });
  };

  const addToExpression = (component) => {
    setExpression([...expression, component]);
    setPreview(preview + component);
  };

  const resetExpression = () => {
    setExpression([]);
    setPreview('');
  };

  const cancelExpression = (pointer) => {
    setExpression((prevExpression) => {
      const newExpression = prevExpression
        .slice(0, pointer - 1)
        .concat(prevExpression.slice(pointer));
      setPreview(newExpression.join(''));
      return newExpression;
    });
  };
  
  const handleInputChange = (event) => {
    const position = event.target.selectionStart;
    console.log('position', position);
    const variableNames = numericVariables
      .map((variable) => variable.key)
      .join('|');
    const algebraicExpressionRegex = new RegExp(
      `^([0-9+\\-*/\\s().]*|(${variableNames}))*$`
    );

    if (algebraicExpressionRegex.test(event.target.value)) {
      const cursorPosition = event.target.selectionEnd;
      console.log('cursorPosition', cursorPosition);
      const newValue = event.target.value.substring(
        event.target.selectionStart - 1,
        event.target.selectionStart
      );
      let x = 0,
        i = 0;

      while (x < cursorPosition - 1 && i < expression.length) {
        x += expression[i].length;
        i++;
      }
      console.log('i', i);
      const newExpression = expression
        .slice(0, i)
        .concat(newValue)
        .concat(expression.slice(i));
      console.log('newExpression', newExpression);

      setExpression(newExpression);
      setPreview(newExpression.join(''));
    } else {
      console.log('Errore nella formattazione');
      setTimeout(() => {
        const nextPositon = position - 1 < 0 ? 0 : position - 1;
        event.target.setSelectionRange(nextPositon, nextPositon);
      }, 0);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Backspace' || event.key === 'Delete') {
      event.preventDefault();
      const cursorPosition = event.target.selectionStart;

      // If the cursor is at the start, do not delete anything
      if (cursorPosition === 0) return;

      if (!expression.length) return;
      let currentIndex = 0;
      let expressionIndex = 0;

      // Map the cursor position to the correct index in the expression array
      for (let i = 0; i < expression?.length; i++) {
        currentIndex += expression[i].length;
        if (currentIndex >= cursorPosition) {
          expressionIndex = i;
          break;
        }
      }

      let newCursorPosition =
        cursorPosition - expression[expressionIndex].length;
      cancelExpression(expressionIndex + 1);

      // Set the cursor position after deletion
      setTimeout(() => {
        console.log('expressionIndex', expressionIndex);

        // If the cursor position is at the start of the expression, set it to 0
        if (newCursorPosition < 0) {
          newCursorPosition = 0;
        }

        event.target.setSelectionRange(newCursorPosition, newCursorPosition);
      }, 0);
    }
  };

  const renderGroup = (params) => {
    return (
      <li key={params.key}>
        <div
          style={{
            backgroundColor: '#e67a0fb3',
            padding: '4px 16px',
            fontWeight: '500',
            fontFamily: 'Montserrat, sans-serif',
            color: '#ffffff',
          }}
        >
          {params.group}
        </div>
        <ul style={{ padding: 0 }}>{params.children}</ul>
      </li>
    );
  };

  const isExpressionValid = (expression) => {
    console.log('expression', expression);
    const operators = ['+', '-', '*', '/', '.'];
    const stack = [];
    let lastElement = '';

    // Remove all whitespace from the expression array
    const cleanedExpression = expression.filter(
      (element) => element.trim() !== ''
    );

    const validateSubExpression = (subExpression) => {
      let lastElement = '';
      for (let i = 0; i < subExpression.length; i++) {
        const element = subExpression[i];

        if (operators.includes(element)) {
          if (operators.includes(lastElement) || lastElement === '(') {
            setError(true);
            setHelperText(
              'Errore: operatore non valido o operatore dopo una parentesi aperta.'
            );
            return false;
          }
          if (element === '/' && subExpression[i + 1] === '0') {
            setError(true);
            setHelperText('Errore: divisione per zero.');
            return false;
          }
        } else {
          // Check for invalid concatenations of variable names without an operator
          if (
            !operators.includes(lastElement) &&
            lastElement !== '' &&
            lastElement !== '(' &&
            lastElement !== ')' &&
            isNaN(lastElement)
          ) {
            setError(true);
            setHelperText(
              'Errore: concatenazione di nomi di variabile senza un operatore.'
            );
            return false;
          }

          // Check for invalid concatenations of variable names with parentheses
          if (
            lastElement === ')' &&
            !operators.includes(element) &&
            element !== '(' &&
            element !== ')' &&
            isNaN(element)
          ) {
            setError(true);
            setHelperText(
              'Errore: concatenazione di nomi di variabile con parentesi senza un operatore.'
            );
            return false;
          }
          // Check for invalid concatenation of dot with variable names
          if (
            lastElement === '.' &&
            !operators.includes(element) &&
            element !== '(' &&
            element !== ')'
          ) {
            setError(true);
            setHelperText(
              'Errore: concatenazione del punto con i nomi di variabili.'
            );
            return false;
          }
        }
        lastElement = element;
      }

      if (operators.includes(lastElement)) {
        setError(true);
        setHelperText(
          'Errore: espressione non può terminare con un operatore.'
        );
        return false;
      }

      return true;
    };

    const processExpression = (expr) => {
      let subExpression = [];
      for (let i = 0; i < expr.length; i++) {
        const element = expr[i];

        if (element === '(') {
          stack.push(subExpression);
          subExpression = [];
        } else if (element === ')') {
          if (stack.length === 0) {
            setError(true);
            setHelperText(
              'Errore: parentesi chiusa senza una parentesi aperta corrispondente.'
            );
            return false;
          }
          if (!validateSubExpression(subExpression)) {
            return false;
          }
          subExpression = stack.pop();
        } else {
          subExpression.push(element);
        }
      }

      if (stack.length !== 0) {
        setError(true);
        setHelperText(
          'Errore: parentesi aperta senza una parentesi chiusa corrispondente.'
        );
        return false;
      }

      return validateSubExpression(subExpression);
    };

    const isValid = processExpression(cleanedExpression);

    if (isValid) {
      setError(false);
      setHelperText('');
    }

    return isValid;
  };

  React.useEffect(() => {
    if (isExpressionValid(expression)) {
      console.log("L'espressione è valida");
    } else {
      console.log("L'espressione non è valida");
    }
  }, [expression]);

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 && (
        <Box
          sx={{
            padding: '3rem 0',
            display: 'flex',
            flexDirection: 'column',
            rowGap: '1.5rem',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              borderBottom: `1px solid ${formLabelColor}`,
              color: formLabelColor,
            }}
          >
            Definisci il contesto:
          </Typography>
          <Autocomplete
            size="small"
            multiple
            groupBy={(option) => option?.sezione || ''}
            options={filteredSubjects}
            value={selectedSubjects}
            getOptionLabel={(option) => option.key || ''}
            onChange={handleSubjectSelect}
            renderGroup={renderGroup}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  size="small"
                  key={option.key}
                  label={option.key}
                  {...getTagProps({ index })}
                  onMouseDown={(event) => event.stopPropagation()}
                />
              ))
            }
            renderInput={(params) => (
              <CssTextField {...params} label="Seleziona i campi" />
            )}
            PopperComponent={(props) => <StyledPopper {...props} />}
            PaperComponent={(props) => (
              <Paper
                {...props}
                sx={{ bgcolor: theme.palette.dropdown.primary }}
              />
            )}
            sx={{ width: '100%' }}
          />

          {selectedSubjects.length > 0 && (
            <Box sx={{ marginTop: 2 }}>
              {selectedSubjects.map((subject, index) => {
                const { key, type, value } = subject;
                let predicateOptions = [];

                switch (type) {
                  case 'numerico':
                    predicateOptions = predicatiNumerici;
                    break;
                  case 'testuale':
                    predicateOptions = predicatiTestuali;
                    break;
                  case 'data':
                    predicateOptions = predicatiData;
                    break;
                  default:
                    predicateOptions = [];
                }

                return (
                  <Box
                    key={key}
                    sx={{
                      marginBottom: 2,
                      display: 'flex',
                      alignItems: 'center',
                      columnGap: '1rem',
                    }}
                  >
                    <Typography
                      sx={{
                        minWidth: '10rem',
                        textTransform: 'uppercase',
                        whiteSpace: 'break-spaces',
                      }}
                      component="span"
                    >
                      {index + 1 + ')  '}
                      {key}{' '}
                    </Typography>
                    <Autocomplete
                      size="small"
                      options={predicateOptions}
                      value={predicates[key] || ''}
                      onChange={(event, selectedPredicate) =>
                        handlePredicateChange(key, selectedPredicate)
                      }
                      renderInput={(params) => (
                        <CssTextField
                          {...params}
                          label="Seleziona un predicato"
                        />
                      )}
                      PopperComponent={(props) => <StyledPopper {...props} />}
                      PaperComponent={(props) => (
                        <Paper
                          {...props}
                          sx={{ bgcolor: theme.palette.dropdown.primary }}
                        />
                      )}
                      sx={{ width: '16rem', display: 'inline-block' }}
                    />
                    <Typography
                      component="span"
                      sx={{ textTransform: 'uppercase' }}
                    >
                      {' '}
                      {value}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          )}
        </Box>
      )}

      {activeStep === 1 && (
        <Box
          sx={{
            padding: '3rem 0',
            display: 'flex',
            flexDirection: 'column',
            rowGap: '1.5rem',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              borderBottom: `1px solid ${formLabelColor}`,
              color: formLabelColor,
            }}
          >
            Costruisci l'espressione:
          </Typography>
          <Autocomplete
            size="small"
            multiple
            options={filteredVariables}
            groupBy={(option) => option?.sezione || ''}
            getOptionLabel={(option) => option.key}
            renderGroup={renderGroup}
            value={selectedVariables}
            onChange={(event, newVariables) =>
              setSelectedVariables(newVariables)
            }
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  size="small"
                  key={option.key}
                  label={
                    numericVariables.filter((v) => v.key === option.key)
                      .length > 1
                      ? option.key + ` (${option.sezione})`
                      : option.key
                  }
                  {...getTagProps({ index })}
                  onMouseDown={(event) => event.stopPropagation()}
                />
              ))
            }
            renderInput={(params) => (
              <CssTextField {...params} label="Variabili numeriche" />
            )}
            PopperComponent={(props) => <StyledPopper {...props} />}
            PaperComponent={(props) => (
              <Paper
                {...props}
                sx={{ bgcolor: theme.palette.dropdown.primary }}
              />
            )}
            sx={{ width: '100%' }}
          />

          {selectedVariables.length > 0 && (
            <Box sx={{ display: 'flex', gap: 2 }}>
              {selectedVariables.map((variable) => (
                <Button
                  key={variable.key}
                  variant="outlined"
                  onClick={() => addToExpression(variable.key)}
                >
                  {variable.key}
                </Button>
              ))}
            </Box>
          )}

          <Box sx={{ display: 'flex', gap: 2 }}>
            {operators.map((operator) => (
              <Button
                key={operator}
                variant="outlined"
                onClick={() =>
                  operator != 'Canc'
                    ? addToExpression(operator)
                    : resetExpression()
                }
              >
                {operator}
              </Button>
            ))}
          </Box>

          <Box>
            <CssTextField
              variant="outlined"
              value={preview || ''}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              label="Aggiungi un numbero, una variabile, un operatore o una parentesi"
              error={error}
              helperText={helperText}
              sx={{ width: '100%', marginTop: 2 }}
            />
          </Box>
        </Box>
      )}

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
            activeStep === steps.length - 1 ? resetExpression : handleNext
          }
        >
          {activeStep === steps.length - 1 ? 'Applica' : 'Avanti'}
        </Button>
      </Box>
    </Box>
  );
}
