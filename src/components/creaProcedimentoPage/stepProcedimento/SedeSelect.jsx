import * as React from 'react';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import {CssTextField,} from "/src/components/Theming.jsx"
import Paper from "@mui/material/Paper";
import { useTheme } from '@mui/material/styles';

const filter = createFilterOptions();

export default function SedeSelect({
  label = 'Sede',
  onChange,
  currValue,
  reset,
  error,
  helperText,
  sx = {} 
}) {
  const theme = useTheme();
  const [value, setValue] = React.useState(currValue ? { sede: currValue } : null);
  const [open, toggleOpen] = React.useState(false);
  const [dialogValue, setDialogValue] = React.useState({ sede: '' });


  // Reset value when `reset` prop changes
  React.useEffect(() => {
    if (reset) resetSede();
  }, [reset]);

  const resetSede = () => {
    setValue(null);
  };

  const handleClose = () => {
    setDialogValue({ sede: '' });
    toggleOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const newSede = { sede: dialogValue.sede.toLocaleUpperCase() };
    setValue(newSede);
    onChange(newSede);
    handleClose();
  };

  const handleAutocompleteChange = (event, newValue) => {
    if (typeof newValue === 'string') {
      setTimeout(() => openDialogForNewSede(newValue));
    } else if (newValue && newValue.inputValue) {
      openDialogForNewSede(newValue.inputValue);
    } else {
      setValue(newValue);
      if (onChange) onChange(newValue);
    }
  };

  const openDialogForNewSede = (inputValue) => {
    toggleOpen(true);
    setDialogValue({ sede: inputValue.toLocaleUpperCase() });
  };

  const filterOptions = (options, params) => {
    const filtered = filter(options, params);
    const inputValue = params.inputValue.toLocaleUpperCase();

    if (inputValue !== '' && !sedi.find(o => o.sede === inputValue)) {
      filtered.push({
        inputValue: inputValue,
        sede: `Aggiungi "${inputValue}"`,
      });
    }

    return filtered;
  };

  return (
    <React.Fragment>
      <Autocomplete
        value={value}
        onChange={handleAutocompleteChange}
        filterOptions={filterOptions}
        id="sede-select"
        options={sedi}
        getOptionLabel={(option) => option.inputValue || option.sede || option}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        PaperComponent={({ children }) => (
          <Paper sx={{ backgroundColor: theme.palette.dropdown.primary }}>{children}</Paper>
        )}
        renderOption={(props, option) => (
          <li {...props} style={{ color: theme.palette.primary.main, fontSize: '.9rem', fontWeight: '400' }}>
            {option.sede}
          </li>
        )}
        freeSolo
        // Imposta le dimensioni direttamente nel sx
        sx={{
          width: '100%',  // Set default width to 100%
          display: 'inline',
          ...sx,  // Permette di sovrascrivere le dimensioni passate tramite prop
          marginRight: '0'
        }}
        renderInput={(params) => (
          <CssTextField
            {...params}
            required
            error={error}
            helperText={helperText}
            label={label} // Utilizza la prop `label`
            size="small"
            sx={{
              '& .MuiOutlinedInput-input': { fontWeight: '500' },
              '& .MuiFormLabel-root': { color: sx.labelColor || theme.palette.text.primary }, // Usa il colore della label dalle props o da `sx`
              ...sx, // Aggiungi anche lo stile `sx` a CssTextField
            }}
          />
        )}
      />
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Nuova {label}</DialogTitle> 
          <DialogContent>
            <DialogContentText>
              Vuoi aggiungere una nuova {label} alla lista?
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              value={dialogValue.sede}
              onChange={(event) =>
                setDialogValue({ ...dialogValue, sede: event.target.value })
              }
              label={label} 
              type="text"
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancella</Button>
            <Button type="submit">Aggiungi</Button>
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  );
}

// Lista delle sedi di esempio
const sedi = [
  { sede: 'NOLA' },
  { sede: 'MEDARB' },
  { sede: 'NAPOLI 3' },
];
