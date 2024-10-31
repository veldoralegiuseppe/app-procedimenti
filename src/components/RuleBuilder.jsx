import React, { useRef, useState } from 'react';
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
import { parse, evaluate, i, exp } from 'mathjs';
import { CssTextField } from '@theme/MainTheme';
import { ProcedimentoContext } from '@context/Procedimento';
import { ProcedimentoMetadata } from '@model/procedimento';
import Regola from '@model/regola';

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

// Steps
const steps = ['Target', 'Contesto', 'Formula'];

// Predicati basati sul tipo del soggetto
const predicatiNumerici = ['è maggiore di', 'è minore di', 'è uguale a'];
const predicatiTestuali = ['è uguale a', 'contiene', 'non contiene'];
const predicatiData = ['è maggiore di', 'è minore di', 'è uguale a'];
const operators = ['Canc'];

export default function RuleBuilder() {
  // Context
  const { procedimento, metadatiProcedimento, notify, setRegole } = React.useContext(ProcedimentoContext);

  // Style
  const theme = useTheme();
  const formLabelColor = '#467bae';

  // State
  const [activeStep, setActiveStep] = useState(0); // Passaggio attivo nello stepper
  const [contestoSelezionato, setContestoSelezionato] = useState([]); // Soggetti selezionati
  const [predicates, setPredicates] = useState({}); // Predicati per ogni soggetto
  const [campoTarget, setCampoTarget] = useState(null); // Variabili numeriche selezionate
  const regola = useRef(new Regola()); // Regola
  const [espressione, setEspressione] = React.useState(regola.current.espressione); // Espressione parent

  // Handler
  const handleNext = () => setActiveStep((prevStep) => prevStep + 1);

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    setEspressione(regola.current.espressione);
  }

  function getCampiNumerici() {
    const numericFields = Object.values(metadatiProcedimento.current)
      .map((field) => ({
        key: field.key,
        label: field.label,
        type: field.type,
        sezione: 'DATI GENERALI',
      }))
      .filter(
        (field) => field.type === 'number' && field.key !== 'valoreControversia'
      );
    //console.log('numericFields', numericFields);
    return numericFields;
  }
  const listaCampiTarget = getCampiNumerici();

  function getContesto() {
    const contestoDatigenerali = Object.values(metadatiProcedimento.current).map(
      (field) => {
        return {
          key: field.key,
          type: field.type,
          label: field.label,
          sezione: 'DATI GENERALI',
          value: procedimento[field.key],
        };
      }
    );

    //console.log('contestoDatigenerali', contestoDatigenerali);
    return contestoDatigenerali;
  }
  const contesto = getContesto();

  const contestoFiltrato = contesto.filter(
    (opzione) =>
      !contestoSelezionato.some((selected) => selected.key === opzione.key)
  );

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

  const handleCreateRule = () => {
    const newRule = new Regola(
      regola.current.target,
      regola.current.tipoTarget,
      regola.current.contesto,
      regola.current.stato,
      regola.current.descrizione,
      regola.current.espressione
    );
    
    const errorMessages = [];
    if(!newRule.target)  errorMessages.push(`Target richiesto`);
    if(!newRule.contesto)  errorMessages.push(`Contesto richiesto`);
    if(regola.current.isValid == false) errorMessages.push(`Espressione non valida`);
    if(newRule.espressione == null || newRule.espressione == undefined || newRule.espressione == '') errorMessages.push(`Espressione richiesta`);
    
    if (errorMessages.length > 0) {
      notify(errorMessages.join('\n'), 'error');
    } else {
      setRegole((prevRegole) => [...prevRegole, newRule]);
      notify('Regola creata con successo', 'success');
    }

    setEspressione(newRule.espressione)
  };

  const handleChangeExpression = ({expression, isValid}) => {
    regola.current.espressione = expression;
    regola.current.isValid = isValid;
    //console.log('regola', regola.current);
  };

  // Builders
  function NumberRuleBuilder({ variabili, onChange, espressione }) {
    const [selectedVariables, setSelectedVariables] = useState([]);
    const [error, setError] = useState(false);
    const [helperText, setHelperText] = useState('');
    const [expression, setExpression] = useState(espressione || ''); // Espressione numerica

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
        if (onChange) {
          onChange({expression, isValid: true});
        }
      } else {
        console.log("L'espressione non è valida");
        if (onChange) {
          onChange({expression, isValid: false});
        }
      }
    }, [expression]);

    // Mapping delle variabili numeriche
    const aliasMap = variabili.reduce((acc, variable, index) => {
      const alias = `VAR${index}`; // alias univoco per ogni variabile
      acc[variable.label.toUpperCase()] = alias;
      return acc;
    }, {});
    //console.log('aliasMap', aliasMap);

    // Mappa dei valori con alias
    const scope = variabili.reduce((acc, variable, index) => {
      const alias = aliasMap[variable.label.toUpperCase()];
      acc[alias] = variable.value && variable.value > 0 ? variable.value : 1; // per evitare errori di divisione per zero
      return acc;
    }, {});
    //console.log('scope', scope);

    const filteredVariables = variabili.filter(
      (variable) =>
        !selectedVariables.some((selected) => selected.key === variable.key)
    );

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
        //console.log('parsedExpression', parsedExpression);

        // Funzione ricorsiva per validare operatori e alias delle variabili
        const validateOperatorsAndVariables = (node) => {
          //console.log('node', node);
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
        //console.log('resultEvaluate', result);
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
          getOptionLabel={(option) => option.label || ''}
          renderGroup={renderGroup}
          value={selectedVariables}
          onChange={(event, newVariables) => setSelectedVariables(newVariables)}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                size="small"
                key={option.key}
                label={option.label}
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
                onClick={() => addToExpression(variable.label)}
              >
                {variable.label.toUpperCase()}
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

      {/* Step target */}
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
            Definisci il target:
          </Typography>
          <Autocomplete
            size="small"
            groupBy={(option) => option?.sezione || ''}
            options={listaCampiTarget}
            value={campoTarget || ''}
            getOptionLabel={(option) => option.label || ''}
            onChange={(event, selectedCampoTarget) => {
              setCampoTarget(selectedCampoTarget);
            }}
            renderGroup={renderGroup}
            renderInput={(params) => (
              <CssTextField {...params} label="Seleziona il campo target" />
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
        </Box>
      )}

      {/* Step contesto */}
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
            Definisci il contesto:
          </Typography>
          <Autocomplete
            size="small"
            multiple
            groupBy={(option) => option?.sezione || ''}
            options={contestoFiltrato}
            value={contestoSelezionato}
            getOptionLabel={(option) => option.label || ''}
            onChange={(event, newContesto) => {
              setContestoSelezionato(newContesto);
            }}
            renderGroup={renderGroup}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  size="small"
                  key={option.key}
                  label={option.label}
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

          {contestoSelezionato.length > 0 && (
            <Box sx={{ marginTop: 2 }}>
              {contestoSelezionato.map((subject, index) => {
                const { key, type, value, label } = subject;
                let predicateOptions = [];

                switch (type) {
                  case 'number':
                    predicateOptions = predicatiNumerici;
                    break;
                  case 'string':
                    predicateOptions = predicatiTestuali;
                    break;
                  case 'datetime':
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
                      {label}{' '}
                    </Typography>
                    <Autocomplete
                      size="small"
                      options={predicateOptions}
                      value={predicates[key] || ''}
                      onChange={(subject, selectedPredicate) => {
                        setPredicates({
                          ...predicates,
                          [subject]: selectedPredicate,
                        });
                      }}
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
      {activeStep === 2 && (
        <NumberRuleBuilder
          variabili={listaCampiTarget}
          onChange={handleChangeExpression}
          espressione={espressione}
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
              ? handleCreateRule
              : handleNext
          }
        >
          {activeStep === steps.length - 1 ? 'Applica' : 'Avanti'}
        </Button>
      </Box>
    </Box>
  );
}
