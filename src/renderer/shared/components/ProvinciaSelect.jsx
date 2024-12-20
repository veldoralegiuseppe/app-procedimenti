import * as React from 'react';
import { Autocomplete, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import * as ComuniUtils from '@assets/js/comuni';
import { CssTextField, labelColor } from '@shared/theme';

function ProvinciaSelect(props, ref) {
  const [error, setError] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [province, setProvince] = React.useState([]); // Stato per la lista delle province
  const [selectedProvince, setSelectedProvince] = React.useState(null); // Stato per la provincia selezionata
  const theme = useTheme();

  // Funzione per caricare le province
  const fetchProvince = async () => {
    setIsLoading(true);
    setError(null); // Resetta eventuali errori
    try {
      const data = await ComuniUtils.getProvince(); // Fetch delle province
      if (data) {
        setProvince(data);
      } else {
        setError('Province non trovate');
      }
    } catch (err) {
      setError('Errore durante il caricamento delle province');
    } finally {
      setIsLoading(false); // Fine del caricamento
    }
  };

  // Effetto che carica le province al montaggio del componente
  React.useEffect(() => {
    fetchProvince();
  }, []);

  // Imposta il ref per consentire l'accesso alla funzione setProvincia
  React.useImperativeHandle(ref, () => ({
    setProvincia(provincia) {
      if (!provincia || !provincia.nome) {
        setSelectedProvince(null);
        return;
      }

      // Cerca una provincia che corrisponda per nome e, se disponibile, anche per regione
      const matchedProvince = province.find(
        (p) =>
          p.nome.toLowerCase() === provincia.nome.toLowerCase() &&
          (!provincia.regione ||
            p.regione.toLowerCase() === provincia.regione.toLowerCase())
      );

      if (matchedProvince) {
        setSelectedProvince(matchedProvince); // Imposta la provincia trovata
      } else {
        console.warn('Provincia non trovata');
      }
    },
  }));

  // Se c'è un errore durante il fetch
  if (error) {
    return (
      <CssTextField
        size="small"
        id="outlined-required-provincia-nascita"
        label={props.label ? props.label : 'Provincia'}
        defaultValue=""
        helperText={error}
        sx={{ ...props.sx }}
      />
    );
  }

  return (
    <Autocomplete
      disablePortal
      disabled={props.disabled || isLoading} // Disabilita se sta caricando o è disabilitato nei props
      id={props.id}
      value={selectedProvince}
      noOptionsText={isLoading ? 'Caricamento...' : 'Nessun risultato'}
      options={province}
      getOptionLabel={(option) => option.nome.toLocaleUpperCase()}
      PaperComponent={({ children }) => (
        <Paper sx={{ backgroundColor: theme.palette.dropdown.primary }}>
          {children}
        </Paper>
      )}
      renderOption={(props, option) => (
        <li
          {...props}
          style={{ color: theme.palette.primary.main, fontSize: '.9rem' }}
        >
          {option.nome.toLocaleUpperCase()}
        </li>
      )}
      sx={{
        ...props.sx,
        display: 'inline-block',
        '& .MuiSvgIcon-root': {
          color:
            props.disabled || isLoading
              ? 'rgba(0, 0, 0, 0.38) !important'
              : labelColor, // Colore dell'icona disabilitata
          transition: 'color 0.3s ease', // Transizione smooth per eventuali cambiamenti di colore
        },
        '&.Mui-disabled .MuiOutlinedInput-root:hover .MuiSvgIcon-root': {
          color: 'rgba(0, 0, 0, 0.38) !important', // Assicura che l'icona rimanga disabilitata anche su hover
          fill: 'rgba(0, 0, 0, 0.38) !important', // Imposta il fill per forzare il colore anche nel caso venga specificato altrove
        },
        '& .MuiOutlinedInput-root:hover .MuiSvgIcon-root': {
          color:
            props.disabled || isLoading
              ? 'rgba(0, 0, 0, 0.38) !important'
              : theme.palette.logo.secondary, // Cambia il colore su hover solo se non è disabilitato
          fill:
            props.disabled || isLoading
              ? 'rgba(0, 0, 0, 0.38) !important'
              : theme.palette.logo.secondary, // Cambia il colore di fill solo se non è disabilitato
        },
        '& .MuiFormLabel-root.Mui-disabled': {
          color: 'rgba(0, 0, 0, 0.38) !important', // Colore della label quando il componente è disabilitato
        },
      }}
      onChange={(event, newValue) => {
        setSelectedProvince(newValue);
        if (props.onChange) {
          props.onChange(newValue); // Chiama il callback onChange passato come prop
        }
      }}
      renderInput={(params) => (
        <CssTextField
          {...params}
          label={props.label || 'Provincia'}
          size="small"
          disabled={props.disabled}
          helperText={props.helperText || ''}
        />
      )}
    />
  );
}

export default React.forwardRef(ProvinciaSelect);
