import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import { useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import * as ComuniUtils from '@assets/js/comuni.js'; // Assicurati che questa funzione esista e funzioni correttamente
import { Comune } from '@model/comune.js';
import { Provincia } from '@model/provincia.js';
import { CssTextField, labelColor } from '@theme/MainTheme';

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
          comune.provincia.nome?.toLowerCase() === provincia.nome?.toLowerCase()
      );
      setFilteredComuni(comuniFiltrati);
    } else {
      setProvincia(null);
      setFilteredComuni([]);
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
      if (
        newProvincia instanceof Provincia &&
        Object.values(newProvincia).every((value) => value !== undefined)
      ) {
        setProvincia(newProvincia);
      } else {
        setProvincia(null);
        resetFields(); 
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
      id={props.id}
      getOptionLabel={(option) => option.nome.toLocaleUpperCase()}
      noOptionsText={
        !provincia ? 'Seleziona una provincia' : 'Nessun comune disponibile'
      }
      onChange={(event, newValue) => {
        setSelectedComune(newValue);
        if (props.onChange) {
          props.onChange(newValue); // Chiama la funzione passata dai props
        }
      }}
      sx={{
        ...props.sx,
        display: 'inline-block',
        '& .MuiSvgIcon-root': {
          color: props.disabled ? 'rgba(0, 0, 0, 0.38) !important' : labelColor, // Colore dell'icona disabilitata
          transition: 'color 0.3s ease', // Transizione smooth per eventuali cambiamenti di colore
        },
        '&.Mui-disabled .MuiOutlinedInput-root:hover .MuiSvgIcon-root': {
          color: 'rgba(0, 0, 0, 0.38) !important', // Assicura che l'icona rimanga disabilitata anche su hover
          fill: 'rgba(0, 0, 0, 0.38) !important', // Imposta il fill per forzare il colore anche nel caso venga specificato altrove
        },
        '& .MuiOutlinedInput-root:hover .MuiSvgIcon-root': {
          color: props.disabled ? 'rgba(0, 0, 0, 0.38) !important' : theme.palette.logo.secondary, // Cambia il colore su hover solo se non è disabilitato
          fill: props.disabled ? 'rgba(0, 0, 0, 0.38) !important' : theme.palette.logo.secondary, // Cambia il colore di fill solo se non è disabilitato
        },
        '& .MuiFormLabel-root.Mui-disabled': {
          color: 'rgba(0, 0, 0, 0.38) !important', // Colore della label quando il componente è disabilitato
        },
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
    />
  );
}

export default React.forwardRef(ComuneSelect);
