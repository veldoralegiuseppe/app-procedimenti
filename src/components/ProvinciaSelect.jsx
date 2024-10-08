import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import { useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';

import * as ComuniUtils from '@assets/js/comuni';
import { CssTextField } from '@theme/MainTheme';

function ProvinciaSelect(props, ref) {
  const [error, setError] = React.useState(null);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [items, setItems] = React.useState([]);
  const [value, setValue] = React.useState(null);
  const theme = useTheme();

  React.useEffect(() => {
    // Definisci una funzione asincrona all'interno di useEffect
    async function fetchProvince() {
      try {
        let province = await ComuniUtils.getProvince();
  
        if (province) {
          setIsLoaded(true);
          setItems(province); // Usa 'province' al posto di 'result' che non era definito
        } else {
          setIsLoaded(false);
          setError('Province non trovate');
        }
      } catch (error) {
        setIsLoaded(false);
        setError(error.message); // Gestisci eventuali errori nella chiamata
      }
    }
  
    // Chiama subito la funzione asincrona
    fetchProvince();
  }, []); // Dipendenze vuote per eseguire l'effetto solo al montaggio
  

  React.useImperativeHandle(ref, () => ({
    setProvincia(value) {
      if (!value) return;
      
      // Assicurati che 'items' sia popolato
      if (!items || items.length === 0) {
        console.log("Le province non sono ancora state caricate.");
        return;
      }
  
      // Cerca la provincia corrispondente in 'items'
      let result = items.find(
        (p) =>
          p.nome === value.nome && 
          p.sigla === value.sigla && 
          (!value.regione || p.regione === value.regione) // Gestione condizionale di 'regione'
      );
  
      if (result) {
        setValue(result); // Imposta il valore trovato
      } else {
        console.log("Provincia non trovata");
      }
    },
  }));
  

  if (error) {
    return (
      <CssTextField
        size="small"
        id="outlined-required-provincia-nascita"
        label={props.label ? props.label : 'Provincia'}
        defaultValue=""
        sx={{ ...props.sx }}
      />
    );
  } else {
    return (
      <Autocomplete
        disablePortal
        disabled={props.disabled ? props.disabled : false}
        id="combo-box-demo"
        value={value}
        noOptionsText={'Nessun risultato'}
        options={items}
        getOptionLabel={(option) =>
          option.nome ? option.nome.toLocaleUpperCase() : ''
        }
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
            {option.nome ? option.nome.toLocaleUpperCase() : ''}
          </li>
        )}
        sx={{ ...props.sx, display: 'inline-block' }}
        onChange={(event, value) => {
          setValue(value);
          props.onChange(value);
        }}
        renderInput={(params) => (
          <CssTextField
            {...params}
            label={props.label ? props.label : 'Provincia'}
            size="small"
            disabled={props.disabled}
            helperText={props.helperText}
          />
        )}
      />
    );
  }
}

export default React.forwardRef(ProvinciaSelect);
