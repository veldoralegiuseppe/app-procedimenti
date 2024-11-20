import * as React from 'react';
import EuroSymbolIcon from '@mui/icons-material/EuroSymbol';
import InputAdornment from '@mui/material/InputAdornment';
import { StyledTextField } from '@theme/ImportoReadOnly';
import { useTheme } from '@mui/material/styles';
import { labelColor as iconColor } from '@theme/MainTheme';
import Tooltip from '@mui/material/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

// Funzione per formattare l'importo in parte intera e decimale
function formatCurrency(value) {
  //console.log(`value.toString: ${value.toString()}`)
  const [integerPart, decimalPart] = value.toString().split('.');
  const formattedIntegerPart = Number(
    integerPart.replace(/\./g, '')
  ).toLocaleString('it-IT');
  const formattedDecimalPart = decimalPart ? decimalPart.padEnd(2, '0') : '00';
  return `${formattedIntegerPart},${formattedDecimalPart}`;
}

export default function ImportoReadOnly({
  value,
  label,
  backgroundColor,
  textColor,
  labelColor,
  borderColor,
  euroIconColor,
  helperText,
  helperTextColor,
  isAutomated = false,
  sx,
}) {
  const theme = useTheme();

  const [formattedValue, setFormattedValue] = React.useState(
    formatCurrency(value)
  );

  // Effetto per aggiornare il valore formattato quando cambia il prop value
  React.useEffect(() => {
    setFormattedValue(formatCurrency(value));
  }, [value]);

  return (
    <StyledTextField
      value={formattedValue} // Importo formattato
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <EuroSymbolIcon sx={{ color: euroIconColor || iconColor }} />
          </InputAdornment>
        ),
        endAdornment: isAutomated ? (
          <Tooltip title="Campo automatizzato" arrow>
            <InputAdornment position="end">
              <InfoOutlinedIcon sx={{ color: euroIconColor || iconColor }} />
            </InputAdornment>
          </Tooltip>
        ) : null,
        readOnly: true, // Campo solo lettura
        style: { color: textColor || theme.palette.text.primary }, // Imposta il colore del testo personalizzabile
        inputProps: {
          draggable: false, // Disabilita il drag del testo
          style: { color: textColor || theme.palette.text.primary }, // Colore del testo personalizzabile
        },
      }}
      sx={{
        
        '& .MuiOutlinedInput-root': {
          cursor: 'not-allowed', // Imposta il cursore per l'intero campo
          borderRadius: '4px',
          backgroundColor: backgroundColor || theme.palette.background.default, // Colore di sfondo fisso
          '& fieldset': {
            cursor: 'not-allowed',
            borderColor: borderColor || theme.palette.divider, // Colore del bordo fisso
          },
          '&:hover fieldset': {
            cursor: 'not-allowed',
            borderColor: borderColor || theme.palette.divider, // Nessun cambiamento del bordo su hover
          },
          '&.Mui-focused fieldset': {
            cursor: 'not-allowed',
            borderColor: borderColor || theme.palette.divider, // Nessun cambiamento del bordo su focus
          },
        },
        '& .MuiInputAdornment-root': {
          cursor: 'not-allowed', // Mostra il cursore not-allowed anche sull'icona Euro
        },
        '& .MuiFormLabel-root': {
          cursor: 'not-allowed',
          color: labelColor || theme.palette.text.secondary, // Imposta il colore della label fisso
        },
        ...sx, // Stili extra tramite sx
      }}
      label={label}
      variant="outlined"
      size="small"
      helperText={helperText || null}
      FormHelperTextProps={{
        sx: { color: helperTextColor || theme.palette.text.disabled },
      }}
    />
  );
}
