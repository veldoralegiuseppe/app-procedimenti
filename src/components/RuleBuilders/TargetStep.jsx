import React, { Component, useState } from 'react';
import { Box, Typography, Autocomplete, Paper } from '@mui/material';
import { styled, useTheme } from '@mui/system';
import Popper from '@mui/material/Popper';
import { CssTextField } from '@theme/MainTheme';
import { ProcedimentoContext } from '@context/Procedimento';
import { Target } from '@model/regola';

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

class TargetsStrategy extends Component {
  _context = null;
  _targetList = ['compensoMediatore'];

  constructor(context) {
    super();
    this._context = context;
  }

  getTargets() {
    const { metadatiProcedimento } = this._context;
    let fields = [];

    fields = Object.values(metadatiProcedimento.current)
    .filter((field) => this._targetList.includes(field.key))
    .map((field) => ({ ...new Target(field.key, field.label, field.type, field.descrizione), scope: field.descrizione }));

    return fields;
  }
}

class TargetsFactory {
  static getTargetsStrategy(context) {
   return new TargetsStrategy(context);
  }
}

export default function TargetStep({
  target,
  onUpdate,
  mode,
}) {
  // Style
  const theme = useTheme();
  const formLabelColor = '#467bae';
  const context = React.useContext(ProcedimentoContext);

  // State
  const [targetSelezionato, setTargetSelezionato] = useState(target || null);
  const [listaTarget, setListaTarget] = useState([]);
  console.log('targetSelezionato', targetSelezionato);

  // Handlers
  const handleChanged = (event, selectedTarget) => {
    setTargetSelezionato(selectedTarget);
    onUpdate({espressione: { target: selectedTarget }});
  };

  // Effetti
  React.useEffect(() => {
    const listaTarget = TargetsFactory.getTargetsStrategy(context).getTargets();
    setListaTarget(listaTarget);
    if(target) setTargetSelezionato(listaTarget.find((t) => t.key === target.key));
  }, []);

  // Funzioni di utilità
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
        Definisci il target:
      </Typography>
      <Autocomplete
        size="small"
        disabled={mode !== 'create'}
        groupBy={(option) => option?.scope || ''}
        options={listaTarget}
        value={targetSelezionato || ''}
        getOptionLabel={(target) => target?.label || ''}
        onChange={handleChanged}
        renderGroup={renderGroup}
        renderInput={(params) => (
          <CssTextField {...params} label="Seleziona il campo target" />
        )}
        PopperComponent={(props) => <StyledPopper {...props} />}
        PaperComponent={(props) => (
          <Paper {...props} sx={{ bgcolor: theme.palette.dropdown.primary }} />
        )}
        sx={{ width: '100%' }}
      />
    </Box>
  );
}
