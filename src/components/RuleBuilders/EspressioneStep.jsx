import React, { Component, useState, useRef, useContext } from 'react';
import { Box, Typography, Button, Chip, Paper } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import Popper from '@mui/material/Popper';
import { CssTextField } from '@theme/MainTheme';
import { evaluate, parse } from 'mathjs';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled, useTheme } from '@mui/material/styles';
import { ProcedimentoContext } from '@context/Procedimento';
import { getVariabiliPredefinite } from '@model/regola';

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

class EspressioneStrategy extends Component {
  _context = null;
  _variabili = [];

  constructor(context) {
    super();
    this._context = context;
  }

  getVariabiliPredefinite() {
    throw Error('Not implemented');
  }

  resolve() {
    throw Error('Not implemented');
  }
}

class EspressioneNumericaStrategy extends EspressioneStrategy {
  constructor(context) {
    super(context);
  }

  getVariabiliPredefinite() {
    this._variabili = getVariabiliPredefinite('number');
    return this._variabili;
  }

  resolve(espressione) {
    if (!espressione) return undefined;

    if (!this._variabili || this._variabili.length === 0)
      this._variabili = getVariabiliPredefinite('number');

    let resolvedFormula = espressione;
    this._variabili.forEach((variabile) => {
      const regex = new RegExp(`\\b${variabile.label.toUpperCase()}\\b`, 'g');
      //console.log('regex', resolvedFormula.replace(regex, variabile.value(this._context)));
      resolvedFormula = resolvedFormula.replace(
        regex,
        variabile.value(this._context)
      );
    });

    return evaluate(resolvedFormula);
  }
}

class EspressioneStrategyFactory {
  static createEspressioneStrategy(context, type) {
    switch (type) {
      case 'numerica':
        return new EspressioneNumericaStrategy(context);
      // Add more cases here for different types of strategies if needed
      default:
        throw new Error(`Unknown strategy type: ${type}`);
    }
  }
}

export default function NumberRuleBuilder({ onUpdate, espressione }) {
  // Style
  const theme = useTheme();
  const formLabelColor = '#467bae';

  // Context
  const procedimentoContext = useContext(ProcedimentoContext);

  // Ref
  const EspressioneStrategy = useRef(
    EspressioneStrategyFactory.createEspressioneStrategy(
      procedimentoContext,
      'numerica'
    )
  );

  // State
  const [variabili, setVariabili] = useState([]);
  const [selectedVariables, setSelectedVariables] = useState([]);
  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState('');
  const [expression, setExpression] = useState(espressione?.formula || '');

  // Effects
  React.useEffect(() => {
    console.log('useEffect expression', expression);

    const transformedExpression = expression?.replace(
      new RegExp(
        Object.keys(aliasMap)
          .map((key) => `\\b${key}\\b`)
          .join('|'),
        'g'
      ),
      (matched) => aliasMap[matched]
    );

    if (
      (!transformedExpression ||
      transformedExpression.trim() != '') &&
      validateExpression(transformedExpression)
    ) {
      console.log("L'espressione è valida");
    //   console.log(
    //     'espressione risolta',
    //     EspressioneStrategy.current.resolve(expression)
    //   );
      if (onUpdate) {
        onUpdate({
          espressione: {
            ...espressione,
            formula: expression === '' ? undefined : expression,
          },
        });
      }
    } else {
      console.log("L'espressione non è valida");
      if (onUpdate) {
        onUpdate({ espressione: { ...espressione, formula: undefined } });
      }
    }
  }, [expression]);

  React.useEffect(() => {
    setVariabili(EspressioneStrategy.current.getVariabiliPredefinite());
  }, []);

  // Constants
  const operators = ['Canc'];

  const aliasMap =
    variabili.length > 0
      ? variabili.reduce((acc, variable, index) => {
          const alias = `VAR${index}`; // alias univoco per ogni variabile
          acc[variable.label.toUpperCase()] = alias;
          return acc;
        }, {})
      : {};
  //console.log('aliasMap', aliasMap);

  const scope =
    variabili.length > 0
      ? variabili.reduce((acc, variable, index) => {
          const alias = aliasMap[variable.label.toUpperCase()];
          acc[alias] =
            variable.value && variable.value > 0 ? variable.value : 1; // per evitare errori di divisione per zero
          return acc;
        }, {})
      : {};
  //console.log('scope', scope);

  // Handlers
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

  // Render
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
          <Paper {...props} sx={{ bgcolor: theme.palette.dropdown.primary }} />
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
            operator !== 'Canc' ? addToExpression(operator) : resetExpression()
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
