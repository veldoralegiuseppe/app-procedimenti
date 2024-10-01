import * as React from 'react';
import {CssTextField,} from "/src/components/Theming.jsx"
import InputAdornment from '@mui/material/InputAdornment';
import { useTheme } from '@mui/material/styles';

const isNumber = (str) => /^[0-9]+$/g.test(str.trim());

const getAnnoValidate = (annoRef) => {
  if (!annoRef) return undefined;
  const str = annoRef.current.value;
  if (!isNumber(str.slice(-1))) annoRef.current.value = str.slice(0, -1);
  return annoRef.current.value === '' ? undefined : annoRef.current.value;
};

const fill = (numProtocollo) => numProtocollo.padStart(6, '0');

const getNumProtocolloValidate = (numProtocolloRef) => {
  if (!numProtocolloRef) return undefined;
  const str = numProtocolloRef.current.value;
  if (!isNumber(str.slice(-1))) numProtocolloRef.current.value = str.slice(0, -1);
  return numProtocolloRef.current.value === '' ? undefined : fill(numProtocolloRef.current.value);
};

export default function RegistroProcedimentoButton({
  onChange,
  numProtocollo,
  anno,
  reset,
  error,
  helperText,
  sx = {},
}) {
  const theme = useTheme();
  const numProtocolloRef = React.useRef(null);
  const annoRef = React.useRef(null);
  const textFieldRef = React.useRef(null);

  // Gestione click esterno per rimuovere il focus
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (textFieldRef.current && !textFieldRef.current.contains(event.target)) {
        if (numProtocolloRef.current.value) {
          numProtocolloRef.current.value = fill(numProtocolloRef.current.value);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Resetta i valori se il reset è attivato
  React.useEffect(() => {
    if (reset) {
      numProtocolloRef.current.value = '';
      annoRef.current.value = new Date().getFullYear();
    }
  }, [reset]);

  return (
   <CssTextField
  error={error}
  helperText={helperText}
  ref={textFieldRef}
  sx={{
    margin: '18px 20px 10px 10px',
    backgroundColor: theme.palette.background.default,
    width: '20%',
    minWidth: '133px',
    maxWidth: '168px',
    '& .MuiInputBase-root': { position: 'relative' },
    '& .MuiFormLabel-root': { color: 'rgb(105 105 105 / 60%)' },
    '& .MuiOutlinedInput-input': { fontWeight: '500' },
    ...sx, // Usa stile personalizzato passato tramite `sx`

    // Disabilita interazione sul contenitore ma consenti l'effetto hover
    pointerEvents: 'none',
    '&:hover': {
      pointerEvents: 'auto', // Permetti il hover sul contenitore
    },
    '&:hover .MuiOutlinedInput-root': {
      borderColor: theme.palette.logo.secondary, // Colore del bordo su hover
    },
    '&:hover .MuiInputLabel-root': {
      color: theme.palette.logo.secondary, // Colore della label su hover
    },
    '&.Mui-focused .MuiInputLabel-root': {
      color: theme.palette.logo.secondary, // Colore della label in focus
    },
  }}
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            color: theme.palette.text.primary,
            width: sx.maxWidth || '100%', // Usa la larghezza del sx
            pointerEvents: 'all', // Riabilita l'interazione per gli input interni
          }}
        >
          {/* Input del numero di protocollo */}
          <input
            onChange={() => onChange(getNumProtocolloValidate(numProtocolloRef), annoRef.current.value)}
            ref={numProtocolloRef}
            maxLength="6"
            defaultValue={numProtocollo}
            type="text"
            style={{
              width: '60%',
              textAlign: 'right',
              fontFamily: 'Roboto',
              fontWeight: '500',
              fontSize: '1rem',
              color: theme.palette.text.primary,
              border: 'none',
              outline: 'none',
              pointerEvents: 'all', // Rende questo input interattivo
            }}
          />
          <span style={{ padding: '0 5px', fontSize: '1.4rem', color: '#cdcdcd' }}>/</span>

          {/* Input dell'anno */}
          <input
            onChange={() => onChange(numProtocolloRef.current.value, getAnnoValidate(annoRef))}
            ref={annoRef}
            defaultValue={anno || new Date().getFullYear()}
            maxLength="4"
            type="text"
            style={{
              width: '40%',
              maxWidth: '65px',
              fontFamily: 'Roboto',
              fontWeight: '500',
              fontSize: '1rem',
              color: theme.palette.text.primary,
              border: 'none',
              outline: 'none',
              pointerEvents: 'all', // Rende questo input interattivo
            }}
          />
        </div>
      </InputAdornment>
    ),
  }}
  id="outlined-basic"
  label="Numero"
  variant="outlined"
  size="small"
  required
  onFocus={(e) => e.target.blur()} // Impedisce che l'input contenitore ottenga il focus
/>

  );
}
