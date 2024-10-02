import * as React from 'react';
import EuroSymbolIcon from '@mui/icons-material/EuroSymbol';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';

// Usa Material-UI styled per stili di base
const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#ccc',  // Colore di default del bordo
    },
    '&:hover fieldset': {
      borderColor: '#ccc',  // Non cambia colore al passaggio del mouse
    },
    '&.Mui-focused fieldset': {
      borderColor: '#ccc',  // Non cambia colore quando è focalizzato
    },
    '&.Mui-disabled fieldset': {
      borderColor: '#ccc',  // Non cambia colore in stato disabilitato
    },
  },
  '& .MuiOutlinedInput-input': {
    fontWeight: '500',  // Stile del testo di default
    userSelect: 'none', // Previene la selezione del testo
    color: theme.palette.text.primary,  // Imposta il colore del testo di default
    cursor: 'not-allowed',  // Mostra il cursore not-allowed anche sul testo
  },
  '& .MuiInputAdornment-root .MuiSvgIcon-root': {
    pointerEvents: 'none',  // Disabilita gli eventi del puntatore sull'icona
  },
  '& .MuiFormLabel-root': {
    color: theme.palette.text.secondary,  // Colore di default della label
    pointerEvents: 'none',  // Disabilita gli eventi del puntatore sull'etichetta
  },
}));

// Funzione per formattare l'importo in migliaia e decimali
function formatCurrency(value) {
  //console.log(`value.toString: ${value.toString()}`)
  const [integerPart, decimalPart] = value.toString().split('.');
  const formattedIntegerPart = Number(integerPart.replace(/\./g, '')).toLocaleString('it-IT');
  const formattedDecimalPart = decimalPart ? decimalPart.padEnd(2, '0') : '00';
  return `${formattedIntegerPart},${formattedDecimalPart}`;
}

// Componente ReadOnlyAmountField con formattazione e personalizzazione dell'helperText
export default function ImportoReadOnly({
  value,
  label,
  backgroundColor = '#d7ebff',
  textColor = '#000000',       // Colore del testo personalizzabile
  labelColor = '#000000',      // Colore della label personalizzabile
  borderColor = '#ccc',        // Colore del bordo personalizzabile
  euroIconColor = '#000000',   // Colore personalizzabile per l'icona Euro
  helperText,                  // Testo di aiuto personalizzabile
  helperTextColor = '#888888', // Colore personalizzabile per l'helperText
  sx,
}) {
  const [formattedValue, setFormattedValue] = React.useState(formatCurrency(value));

  // Effetto per aggiornare il valore formattato quando cambia il prop value
  React.useEffect(() => {
    setFormattedValue(formatCurrency(value));
  }, [value]);

  return (
    <StyledTextField
      value={formattedValue}  // Importo formattato
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <EuroSymbolIcon sx={{ color: euroIconColor }} />
          </InputAdornment>
        ),
        readOnly: true,  // Campo solo lettura
        style: { color: textColor },  // Imposta il colore del testo personalizzabile
        inputProps: {
          draggable: false,  // Disabilita il drag del testo
          style: { color: textColor }, // Colore del testo personalizzabile
        },
      }}
      sx={{
        backgroundColor: backgroundColor,  // Colore di sfondo fisso
        '& .MuiOutlinedInput-root': {
          cursor: 'not-allowed',  // Imposta il cursore per l'intero campo
          borderRadius: '4px',
          backgroundColor: backgroundColor,  // Colore di sfondo fisso
          '& fieldset': {
            cursor: 'not-allowed',
            borderColor: borderColor,  // Colore del bordo fisso
          },
          '&:hover fieldset': {
            cursor: 'not-allowed',
            borderColor: borderColor,  // Nessun cambiamento del bordo su hover
          },
          '&.Mui-focused fieldset': {
            cursor: 'not-allowed',
            borderColor: borderColor,  // Nessun cambiamento del bordo su focus
          },
        },
        '& .MuiInputAdornment-root': {
          cursor: 'not-allowed',  // Mostra il cursore not-allowed anche sull'icona Euro
        },
        '& .MuiFormLabel-root': {
          cursor: 'not-allowed',
          color: labelColor,  // Imposta il colore della label fisso
        },
        ...sx,  // Stili extra tramite sx
      }}
      label={label}
      variant="outlined"
      size="small"
      helperText={helperText || "Calcolato automaticamente"}
      FormHelperTextProps={{
        sx: { color: helperTextColor },
      }}
    />
  );
}
