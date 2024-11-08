import * as React from 'react';
import { CssTextField } from '@theme/MainTheme';
import InputAdornment from '@mui/material/InputAdornment';
import { Box, useTheme } from '@mui/material';

const fillProtocollo = (numProtocollo) => numProtocollo.padStart(6, '0');

export default function ProtocolloInput({
  onChange,
  numProtocollo = '',
  anno = new Date().getFullYear(),
  error,
  helperText,
  label = '',
  sx = {},
}) {
  const theme = useTheme();
  const numProtocolloRef = React.useRef(null);
  const annoRef = React.useRef(null);
  const textFieldRef = React.useRef(null);

  // Gestisce il riempimento del numero di protocollo quando si clicca fuori dal componente
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        textFieldRef.current &&
        !textFieldRef.current.contains(event.target)
      ) {
        if (numProtocolloRef.current.value) {
          numProtocolloRef.current.value = fillProtocollo(
            numProtocolloRef.current.value
          );
          onChange(numProtocolloRef.current.value, annoRef.current.value);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onChange]);

  // Aggiorna il campo quando i valori di protocollo e anno cambiano
  React.useEffect(() => {
    if (numProtocolloRef.current) {
      numProtocolloRef.current.value = numProtocollo;
    }
    if (annoRef.current) {
      annoRef.current.value = anno;
    }
  }, [numProtocollo, anno]);

  return (
    <CssTextField
      error={error}
      helperText={helperText}
      ref={textFieldRef}
      sx={{
        margin: '18px 20px 10px 10px',
        backgroundColor: theme.palette.background.default,
        width: '160px', // Assicura che il campo si estenda su tutto il contenitore
        '& .MuiInputBase-root': { position: 'relative' },
        '& .MuiInputBase-adornedStart': { paddingLeft: '0px' }, // Rimuove padding-left
        ...sx,
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between" // Distribuisce gli input all'interno della Box
              sx={{ width: sx.width ? sx.width : '160px', paddingLeft: '0' }}
            >
              {/* Input del numero di protocollo */}
              <input
                ref={numProtocolloRef}
                maxLength="6"
                defaultValue={numProtocollo}
                type="text"
                style={{
                  width: '60%', // Lo spazio occupato dal numero di protocollo
                  textAlign: 'right',
                  fontFamily: 'Roboto',
                  fontSize: '1rem',
                  color: theme.palette.text.primary,
                  border: 'none',
                  outline: 'none',
                  padding: '0',
                  paddingRight: '1px',
                  backgroundColor: 'transparent', // Mantiene lo stile di background del TextField
                }}
                onChange={() =>
                  onChange(
                    numProtocolloRef.current.value,
                    annoRef.current.value
                  )
                }
              />

              {/* Separator "/". Serve per separare il numero di protocollo dall'anno */}
              <span
                style={{
                  padding: '0 5px',
                  fontSize: '1.4rem',
                  color: '#cdcdcd',
                }}
              >
                /
              </span>

              {/* Input dell'anno */}
              <input
                ref={annoRef}
                defaultValue={anno || new Date().getFullYear()}
                maxLength="4"
                type="text"
                style={{
                  width: '30%', // Lo spazio occupato dall'anno
                  textAlign: 'left',
                  fontFamily: 'Roboto',
                  fontSize: '1rem',
                  color: theme.palette.text.primary,
                  border: 'none',
                  outline: 'none',
                  padding: '0',
                  backgroundColor: 'transparent', // Mantiene lo stile di background del TextField
                }}
                onChange={() =>
                  onChange(
                    numProtocolloRef.current.value,
                    annoRef.current.value
                  )
                }
              />
            </Box>
          </InputAdornment>
        ),
      }}
      id="outlined-basic"
      label={label}
      variant="outlined"
      size="small"
      required
    />
  );
}
