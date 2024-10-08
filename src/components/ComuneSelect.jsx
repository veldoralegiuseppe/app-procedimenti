import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import { useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import * as ComuniUtils from '@assets/js/comuni.js'; // Assicurati che questa funzione esista e funzioni correttamente
import { Comune } from '@model/comune.js';
import { Provincia } from '@model/provincia.js';
import { CssTextField } from '@theme/MainTheme';

function ComuneSelect(props, ref) {
  const [comuni, setComuni] = React.useState([]); // Lista di tutti i comuni
  const [filteredComuni, setFilteredComuni] = React.useState([]); // Lista di comuni filtrati
  const [provincia, setProvincia] = React.useState(null); // La provincia selezionata
  const [selectedComune, setSelectedComune] = React.useState(null); // Il comune selezionato
  const [error, setError] = React.useState(null); // Gestione degli errori
  const theme = useTheme();

  // Funzione di inizializzazione dei comuni
  const fetchComuni = async () => {
    try {
      const comuni = await ComuniUtils.getComuni();
      setComuni(comuni);
    } catch (err) {
      setError('Errore durante il caricamento dei comuni.');
    }
  };

  // Effetto per caricare tutti i comuni al montaggio del componente
  React.useEffect(() => {
    fetchComuni();
  }, []);

  // Effetto che si attiva quando cambia la provincia
  React.useEffect(() => {
    if (provincia) {
      // Filtra i comuni in base alla provincia selezionata
      const comuniFiltrati = comuni.filter(
        (comune) =>
          comune.provincia &&
          comune.provincia.nome.toLowerCase() === provincia.nome.toLowerCase()
      );
      setFilteredComuni(comuniFiltrati);
    } else {
      setFilteredComuni([]); // Se non c'è provincia, resetta i comuni filtrati
    }
  }, [provincia, comuni]);

  // Funzione per resettare i campi
  const resetFields = () => {
    setProvincia(null);
    setSelectedComune(null);
    setFilteredComuni([]);
  };

  // Utilizzo di `useImperativeHandle` per consentire il controllo da un componente padre
  React.useImperativeHandle(ref, () => ({
    setProvincia(newProvincia) {
      console.log('imperative')
      if (newProvincia instanceof Provincia) {
        setProvincia(newProvincia);
        console.log(provincia)
      } else {
        resetFields(); // Se non è una provincia valida, resetta tutto
      }
    },
    setComune(newComune) {
      if (newComune instanceof Comune) {
        setProvincia(newComune.provincia);
        setSelectedComune(newComune);
      } else {
        resetFields(); // Se non è un comune valido, resetta tutto
      }
    },
  }));

  // Gestione degli errori
  if (error) {
    return (
      <CssTextField
        size="small"
        id="outlined-error"
        label={props.label || 'Comune'}
        defaultValue=""
        helperText={error}
        sx={{ ...props.sx }}
      />
    );
  }

  return (
    <Autocomplete
      disabled={!provincia || props.disabled}
      options={filteredComuni}
      value={selectedComune}
      getOptionLabel={(option) => option.nome.toLocaleUpperCase()}
      noOptionsText={!provincia ? 'Seleziona una provincia' : 'Nessun comune disponibile'}
      onChange={(event, newValue) => {
        setSelectedComune(newValue);
        if (props.onChange) {
          props.onChange(newValue); // Chiama la funzione passata dai props
        }
      }}
      isOptionEqualToValue={(option, value) => option.nome === value.nome}
      PaperComponent={({ children }) => (
        <Paper sx={{ backgroundColor: theme.palette.dropdown.primary }}>
          {children}
        </Paper>
      )}
      renderOption={(props, option) => (
        <li {...props} style={{ color: theme.palette.primary.main }}>
          {option.nome.toLocaleUpperCase()}
        </li>
      )}
      renderInput={(params) => (
        <CssTextField
          {...params}
          disabled={!provincia || props.disabled}
          label={props.label || 'Comune'}
          size="small"
          helperText={
            props.disabled
              ? props.helperText
              : !provincia
              ? 'Seleziona una provincia per attivare questo campo'
              : ''
          }
        />
      )}
      sx={{
        ...props.sx,
        display: 'inline-block',
        '& .MuiAutocomplete-inputRoot.Mui-disabled': {
          pointerEvents: 'none',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#eaeaea !important',
          },
        },
      }}
    />
  );
}

export default React.forwardRef(ComuneSelect);
