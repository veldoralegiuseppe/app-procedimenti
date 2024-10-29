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
import DeleteIcon from '@mui/icons-material/Delete';
import { parse, evaluate } from 'mathjs';
import { CssTextField } from '@theme/MainTheme';

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

const steps = ['Definisci il contesto', 'Definisci la formula'];

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
  { key: 'Valore della controversia', sezione: 'Procedimento', value: 1 },
  { key: 'Incasso parti', sezione: 'Parti / Controparti', value: 1 },
  {
    key: 'Incasso controparti',
    sezione: 'Parti / Controparti',
    value: 1,
  },
  { key: 'Spese avvio parti', sezione: 'Parti / Controparti', value: 1 },
  { key: 'Spese avvio controparti', sezione: 'Parti / Controparti', value: 1 },
].sort((a, b) => a.sezione.localeCompare(b.sezione));

// Predicati basati sul tipo del soggetto
const predicatiNumerici = ['è maggiore di', 'è minore di', 'è uguale a'];
const predicatiTestuali = ['è uguale a', 'contiene', 'non contiene'];
const predicatiData = ['è maggiore di', 'è minore di', 'è uguale a'];
const operators = ['Canc'];
const subjects = Object.values(procedureModel);

export default function RuleBuilder() {
  // Style
  const theme = useTheme();
  const formLabelColor = '#467bae';

  // State
  const [activeStep, setActiveStep] = useState(0); // Passaggio attivo nello stepper
  const [selectedSubjects, setSelectedSubjects] = useState([]); // Soggetti selezionati
  const [predicates, setPredicates] = useState({}); // Predicati per ogni soggetto

  // Handler
  const handleNext = () => setActiveStep((prevStep) => prevStep + 1);
  const handleBack = () => setActiveStep((prevStep) => prevStep - 1);

  const filteredSubjects = subjects.filter(
    (subject) =>
      !selectedSubjects.some((selected) => selected.key === subject.key)
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

  // Components
  function NumberRuleBuilder() {
    const [selectedVariables, setSelectedVariables] = useState([]); // Variabili numeriche selezionate
    const [error, setError] = useState(false);
    const [helperText, setHelperText] = useState('');
    const [expression, setExpression] = useState(''); // Espressione numerica in anteprima

    React.useEffect(() => {
      const transformedExpression = expression.replace(
        new RegExp(
          Object.keys(aliasMap)
            .map((key) => `\\b${key}\\b`)
            .join('|'),
          'g'
        ),
        (matched) => aliasMap[matched]
      );

      if (validateExpression(transformedExpression)) {
        console.log("L'espressione è valida");
      } else {
        console.log("L'espressione non è valida");
      }
    }, [expression]);

    // Mapping delle variabili numeriche
    const aliasMap = numericVariables.reduce((acc, variable, index) => {
      const alias = `VAR${index}`; // alias univoco per ogni variabile
      acc[variable.key.toUpperCase()] = alias;
      return acc;
    }, {});

    // Mappa dei valori con alias
    const scope = numericVariables.reduce((acc, variable, index) => {
      const alias = aliasMap[variable.key.toUpperCase()];
      acc[alias] = variable.value;
      return acc;
    }, {});

    const filteredVariables = numericVariables
      .filter(
        (variable) =>
          !selectedVariables.some((selected) => selected.key === variable.key)
      )
      .map((variable) => ({
        ...variable,
        key: variable.key.toUpperCase(),
        sezione: variable.sezione.toUpperCase(),
      }));

    const addToExpression = (component) => {
      setExpression(
        (prevExpression) => prevExpression + String(component).toUpperCase()
      );
    };

    const resetExpression = () => {
      setExpression('');
    };

    const handleInputChange = (event) => {
      const inputToUppercase = event.target.value.toUpperCase();
      setExpression(inputToUppercase);
    };

    const setValidationError = (message) => {
      const sanitizedMessage = message.replace(/\(.*?\)/g, '').trim();
      const translatedMessage = translateMessageToItalian(sanitizedMessage);
      setError(true);
      setHelperText(translatedMessage);
    };

    const translateMessageToItalian = (message) => {
      const translations = {
        'Invalid variable:': 'Variabile non valida:',
        'Unexpected end of expression': "Fine inaspettata dell'espressione",
        'Unexpected type of argument': 'Tipo di argomento inaspettato',
        'Unexpected operator': 'Operatore inaspettato',
        'Parenthesis mismatch': 'Disallineamento delle parentesi',
        'Undefined symbol': 'Simbolo non definito',
        'Syntax error': 'Errore di sintassi',
        'Division by zero': 'Divisione per zero',
        'Invalid number': 'Numero non valido',
        'Value expected': 'Valore richiesto',
      };

      // Rileva tutte le chiavi che iniziano con "Unexpected" e che non sono contenute in translations
      if (
        message.startsWith('Unexpected') &&
        !Object.keys(translations).some((key) => message.includes(key))
      ) {
        return 'Elemento inaspettato';
      }

      for (const [english, italian] of Object.entries(translations)) {
        if (message.includes(english)) {
          return message.replace(english, italian);
        }
      }

      return message; // Return the original message if no translation is found
    };

    const validateExpression = (transformedExpression) => {
      try {
        // Esegui il parsing dell'espressione trasformata
        const parsedExpression = parse(transformedExpression);

        // Funzione ricorsiva per validare operatori e alias delle variabili
        const validateOperatorsAndVariables = (node) => {
          if (node.isSymbolNode) {
            const variableName = node.name;
            if (!Object.values(aliasMap).includes(variableName)) {
              throw new Error(`Variabile non valida: ${variableName}`);
            }
          }

          if (node.args && Array.isArray(node.args)) {
            node.args.forEach((arg) => validateOperatorsAndVariables(arg));
          } else if (node.content) {
            validateOperatorsAndVariables(node.content);
          }
        };

        // Valida operatori e variabili alias nell'espressione analizzata
        validateOperatorsAndVariables(parsedExpression);

        // Valuta l'espressione trasformata usando il contesto `scope`
        let result = evaluate(transformedExpression, scope);
        if (result === Infinity || result === -Infinity) {
          throw new Error('Divisione per zero');
        }

        // L'espressione è valida se non ci sono errori
        setError(false);
        setHelperText('');
        return true;
      } catch (error) {
        setValidationError(error.message);
        return false;
      }
    };

    return (
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
          getOptionLabel={(option) =>
            option.key.charAt(0).toUpperCase() +
            option.key.slice(1).toLowerCase()
          }
          renderGroup={renderGroup}
          value={selectedVariables}
          onChange={(event, newVariables) => setSelectedVariables(newVariables)}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                size="small"
                key={option.key}
                label={
                  numericVariables.filter((v) => v.key === option.key).length >
                  1
                    ? option.key.charAt(0).toUpperCase() +
                      option.key.slice(1).toLowerCase() +
                      ` (${
                        option.sezione?.charAt(0).toUpperCase() +
                        option.sezione?.slice(1).toLowerCase()
                      })`
                    : option.key.charAt(0).toUpperCase() +
                      option.key.slice(1).toLowerCase()
                }
                {...getTagProps({ index })}
                onMouseDown={(event) => event.stopPropagation()}
              />
            ))
          }
          renderInput={(params) => (
            <CssTextField {...params} label="Variabili predefinite" />
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
                {variable.key.toUpperCase()}
              </Button>
            ))}
          </Box>
        )}

        <Box>
          <CssTextField
            variant="outlined"
            value={expression || ''}
            onChange={handleInputChange}
            label="Aggiungi un numero, una variabile, un operatore o una parentesi"
            error={error}
            helperText={helperText}
            sx={{ width: '100%', height: '53px' }}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}></Box>
        {operators.map((operator) => (
          <Button
            key={operator}
            size="small"
            variant="outlined"
            onClick={() =>
              operator !== 'Canc'
                ? addToExpression(operator)
                : resetExpression()
            }
            sx={
              operator === 'Canc'
                ? {
                    width: '6rem',
                    backgroundColor: '#8f2626',
                    borderColor: 'unset',
                    color: '#ffffff',
                    '&:hover': {
                      backgroundColor: theme.palette.error.dark,
                    },
                  }
                : { width: '6rem' }
            }
            startIcon={
              operator === 'Canc' ? (
                <DeleteIcon sx={{ fontSize: '15px' }} />
              ) : null
            }
          >
            {operator}
          </Button>
        ))}
      </Box>
    );
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

      {/* Step contesto */}
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

      {/* Step espressione numerica */}
      {activeStep === 1 && <NumberRuleBuilder />}

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
          onClick={activeStep === steps.length - 1 ? () => {} : handleNext}
        >
          {activeStep === steps.length - 1 ? 'Applica' : 'Avanti'}
        </Button>
      </Box>
    </Box>
  );
}
