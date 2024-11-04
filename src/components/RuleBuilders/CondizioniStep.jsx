import React, { Component, useState, useRef } from 'react';
import { Box, Typography, Autocomplete, Chip, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import styled from '@emotion/styled';
import Popper from '@mui/material/Popper';
import { CssTextField } from '@theme/MainTheme';
import ImportoInput from '@components/ImportoInput';
import { ProcedimentoContext } from '@context/Procedimento';
import { Target } from '@model/regola';
import Select from '@components/Select';
import { oggettiControversia, esitiMediazione } from '@model/procedimento';

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

class ContextStrategy extends Component {
  _context = null;
  _campiCondizioni = [
    'oggettoControversia',
    'valoreControversia',
    'esitoMediazione',
  ];

  constructor(context) {
    super();
    this._context = context;
  }

  getTargets() {
    const { metadatiProcedimento } = this._context;
    let fields = [];

    fields = Object.values(metadatiProcedimento.current)
      .filter((field) => this._campiCondizioni.includes(field.key))
      .map((field) => ({
        ...new Target(field.key, field.label, field.type, field.descrizione),
        scope: field.descrizione,
        valore: this.getTargetValue(field),
      }));

    return fields;
  }

  getTargetValue(campo) {
    const { procedimento } = this._context;
    console.log('procedimento', procedimento);

    switch (campo.descrizione) {
      case 'DATI GENERALI':
        return procedimento[campo.key];
      default:
        return undefined;
    }
  }
}

class ContextFactory {
  static getContextStrategy(context) {
    return new ContextStrategy(context);
  }
}

const TargetInput = ({
  target,
  isIntervallo = false,
  isMin = false,
  condizioniLocal,
  setCondizioniLocal,
  onUpdate,
}) => {
  // Handlers
  const condizione = condizioniLocal.find((c) => c.campo.key === target.key);
  const checkForErrors = (value, condizione, isMin) => {
    if (isMin && condizione?.valore != undefined && value > condizione.valore) {
      return 'Il valore minimo deve essere inferiore al valore massimo';
    } else if (
      !isMin &&
      condizione?.valoreMin != undefined &&
      value < condizione.valoreMin
    ) {
      return 'Il valore massimo deve essere superiore al valore minimo';
    } else {
      return null;
    }
  };
  const handleValueChange = (newValue) => {
    const value =
      typeof newValue === 'object' && newValue.target
        ? newValue.target.value
        : newValue;
    const updatedCondizioni = condizioniLocal.map((condizione) =>
      condizione.campo.key === target.key
        ? isMin
          ? { ...condizione, valoreMin: value }
          : { ...condizione, valore: value }
        : condizione
    );

    const error = checkForErrors(value, condizione, isMin);
    setError(error);

    setCondizioniLocal(updatedCondizioni);
    onUpdate({ condizioni: updatedCondizioni });
  };

  // Costanti
  const value = isMin ? condizione?.valoreMin : condizione?.valore;

  // State
  const [error, setError] = useState(null);

  React.useEffect(() => {
    console.log('verifico errori');
    setError(checkForErrors(value, condizione, isMin));
  }, [value, condizione, isMin]);

  const targetInputProps = {
    value: value || (target.type === 'number' ? 0 : ''),
    onChange: handleValueChange,
    label: isIntervallo ? (isMin ? target.label + ' (min)' : target.label + ' (max)') : target.label,
    required: true,
    error: error != null,
    helperText: error,
  };
  const targetInputMap = {
    oggettoControversia: (
      <Select
        {...targetInputProps}
        options={oggettiControversia}
        sx={{ height: '34.13px' }}
      />
    ),
    esitoMediazione: (
      <Select
        {...targetInputProps}
        options={esitiMediazione}
        sx={{ height: '34.13px' }}
      />
    ),
    number: <ImportoInput {...targetInputProps} />,
    string: <CssTextField {...targetInputProps} />,
    // 'datetime': <DateTimeInput {...targetInputProps} />
  };

  return targetInputMap[target.key] || targetInputMap[target.type];
};

export default function ContextStep({ condizioni, onUpdate }) {
  // Style
  const theme = useTheme();
  const formLabelColor = '#467bae';

  // Context
  const procedimentoContext = React.useContext(ProcedimentoContext);

  // State
  const [campiSelezionati, setCampiSelezionati] = useState(
    condizioni?.map((c) => c.campo) || []
  );
  const [campi, setCampi] = useState([]);
  const [condizioniLocal, setCondizioniLocal] = useState(condizioni || []);

  // Ref
  const ContextStrategy = useRef(
    ContextFactory.getContextStrategy(procedimentoContext)
  );

  // Handlers
  const handleCampoChange = (event, newCampiSelezionati) => {
    setCampiSelezionati(newCampiSelezionati);
    const updatedCondizioni = condizioniLocal;
    newCampiSelezionati.forEach((campo) => {
      if (!updatedCondizioni.find((cond) => cond.campo.key === campo.key))
        updatedCondizioni.push({
          campo: campo,
          operatore: undefined,
          valore: campo.valore,
          scope: campo.scope,
        });
    });
    setCondizioniLocal([...updatedCondizioni]);
    console.log('condizioniLocali', [...updatedCondizioni]);
    onUpdate({ condizioni: [...updatedCondizioni] });
  };
  const handleChipDelete = (target) => {
    const newCampiSelezionati = campiSelezionati.filter(
      (campo) => campo.key !== target.key
    );
    setCampiSelezionati(newCampiSelezionati);
    const newCondizioniLocal = condizioniLocal.filter(
      (condizione) => condizione.campo.key !== target.key
    );
    setCondizioniLocal(newCondizioniLocal);
    onUpdate({ condizioni: newCondizioniLocal });
  };
  const handleOperatoreChange = (event, newOperatore, campo) => {
    // Trova l'oggetto da modificare
    const condizione = condizioniLocal.find(
      (cond) => cond.campo.key === campo.key
    );

    if (condizione) {
      // Modifica l'oggetto
      condizione.operatore = newOperatore;
      if (newOperatore && newOperatore.includes('compreso tra')) {
        condizione.valoreMin = condizione.valoreMin
          ? condizione.valoreMin
          : campo.type === 'number'
          ? 0
          : '';
      }

      // Aggiorna lo stato locale
      setCondizioniLocal([...condizioniLocal]);
      onUpdate({ condizioni: [...condizioniLocal] });
    }
  };
  const operatoriMap = {
    number: {
      '>': (a, b) => a > b,
      '≥': (a, b) => a >= b,
      '<': (a, b) => a < b,
      '≤': (a, b) => a <= b,
      '=': (a, b) => a === b,
      'compreso tra': (a, b) => a >= b[0] && a <= b[1],
    },
    string: {
      '=': (a, b) => a === b,
      contiene: (a, b) => a.includes(b),
      'non contiene': (a, b) => !a.includes(b),
    },
    datetime: {
      '>': (a, b) => new Date(a) > new Date(b),
      '<': (a, b) => new Date(a) < new Date(b),
      '=': (a, b) => new Date(a).getTime() === new Date(b).getTime(),
    },
  };

  // Effetti
  React.useEffect(() => {
    setCampi(
      ContextStrategy.current
        .getTargets()
        .filter((target) => !campiSelezionati.includes(target))
    );
  }, []);

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
        Definisci le condizioni:
      </Typography>
      <Autocomplete
        size="small"
        multiple
        groupBy={(option) => option?.scope || ''}
        options={campi.filter((target) => !campiSelezionati.includes(target))}
        value={campiSelezionati}
        getOptionLabel={(target) => target?.label || ''}
        onChange={handleCampoChange}
        renderGroup={renderGroup}
        renderTags={(targetSelezionati, getTagProps) =>
          targetSelezionati.map((target, index) => (
            <Chip
              size="small"
              key={target.key}
              label={target.label}
              {...getTagProps({ index })}
              onMouseDown={(event) => event.stopPropagation()}
              onDelete={() => handleChipDelete(target)}
            />
          ))
        }
        renderInput={(params) => (
          <CssTextField {...params} label="Seleziona i campi" />
        )}
        PopperComponent={(props) => <StyledPopper {...props} />}
        PaperComponent={(props) => (
          <Paper {...props} sx={{ bgcolor: theme.palette.dropdown.primary }} />
        )}
        sx={{ width: '100%' }}
      />

      {campiSelezionati.length > 0 && (
        <Box sx={{ marginTop: 2, display: 'flex', flexDirection: 'column', rowGap: '1rem'  }}>
          {campiSelezionati.map((target, index) => {
            const condizione = condizioniLocal.find((c) => c.campo.key === target.key);
            const isIntervallo = condizione?.operatore?.includes('compreso tra');

            return (
              <Box
                key={target.label + '_' + index}
                sx={{
                  marginBottom: 2,
                  display: 'flex',
                  alignItems: 'center',
                  columnGap: '1rem',
                }}
              >
                <React.Fragment>
                  {/* Target */}
                  <Typography
                    sx={{
                      minWidth: '10rem',
                      textTransform: 'uppercase',
                      whiteSpace: 'break-spaces',
                      color: '#1c69b3',
                      minWidth: '16rem',
                    }}
                    component="span"
                  >
                    {index + 1 + ')  ' + target.label + ':'}{' '}
                  </Typography>

                  <div style={{ display: 'flex', flexWrap: 'wrap', rowGap: '1rem', columnGap: '1rem', alignItems: 'center', width: '100%' }}>
                    {/* Valore min (condizionale) */}
                    {isIntervallo && (
                      <TargetInput
                        target={target}
                        isIntervallo={true}
                        isMin={true}
                        condizioniLocal={condizioniLocal}
                        setCondizioniLocal={setCondizioniLocal}
                        onUpdate={onUpdate}
                      />
                    )}

                    {/* Operatore */}
                    <Autocomplete
                      size="small"
                      options={Object.keys(operatoriMap[target.type])}
                      value={condizione?.operatore || ''}
                      onChange={(event, newOperatore) =>
                        handleOperatoreChange(event, newOperatore, target)
                      }
                      renderInput={(params) => (
                        <CssTextField
                          {...params}
                          label="Operatore"
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

                    {/* Valore / Valore max */}
                    <TargetInput
                      isIntervallo={isIntervallo}
                      isMin={false}
                      target={target}
                      condizioniLocal={condizioniLocal}
                      setCondizioniLocal={setCondizioniLocal}
                      onUpdate={onUpdate}
                    />
                  </div>
                </React.Fragment>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
