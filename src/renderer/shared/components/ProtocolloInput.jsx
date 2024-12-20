import * as React from 'react';
import { CssTextField } from '@shared/theme';
import InputAdornment from '@mui/material/InputAdornment';
import { Box, useTheme } from '@mui/material';
import { validators } from '@utils';
import _ from 'lodash';

const fillProtocollo = (protocollo) => {
  if (!protocollo) return '';
  else return protocollo.padStart(6, '0');
};

const isValid = (protocollo) => {
  return validators.isProtocollo(protocollo) === true;
};

export default function ProtocolloInput({
  onChange,
  value = '',
  error,
  helperText,
  onBlur,
  label = '',
  sx = {},
}) {
  const theme = useTheme();
  const numProtocolloRef = React.useRef(null);
  const annoRef = React.useRef(null);
  const textFieldRef = React.useRef(null);
  const [numProtocollo, setNumProtocollo] = React.useState(value);

  // Aggiorna il campo quando i valori di protocollo e anno cambiano
  React.useEffect(() => {
    const numProt = value ? fillProtocollo(value.split('/')[0]) : '';
    const annoProt = value
      ? value.split('/')[1]
      : `${new Date().getFullYear()}`;
    const updatedProtocollo = `${numProt}/${annoProt}`;

    numProtocolloRef.current.value = numProt;
    annoRef.current.value = annoProt;

    if (!_.isEqual(numProtocollo, updatedProtocollo)) {
      setNumProtocollo(updatedProtocollo);
    }
  }, [value]);

  React.useEffect(() => {
    if (!isValid(numProtocollo)) {
      if (!value) return;
      else onChange?.(undefined);
    } else onChange?.(numProtocollo);
  }, [numProtocollo]);

  const handleChange = (e) => {
    if (typeof validators.onlyNumber(e.target.value) === 'string') {
      console.log('input errato');
      e.preventDefault();
      e.target.value = e.target.value.slice(0, -1);
    }
  };

  const handleOnBlur = () => {
    const protocollo = fillProtocollo(numProtocolloRef.current.value);
    if(protocollo) numProtocolloRef.current.value = protocollo;
    const anno = annoRef.current.value;
    const numProtocollo = `${protocollo}/${anno}`;
    onBlur?.(numProtocollo);
    setNumProtocollo(numProtocollo);
  };

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
                onChange={(e) => handleChange(e)}
                onBlur={handleOnBlur}
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
                onChange={(e) => handleChange(e)}
                onBlur={handleOnBlur}
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
