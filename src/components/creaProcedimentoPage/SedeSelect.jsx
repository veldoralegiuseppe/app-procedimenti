import * as React from 'react';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { CssTextField } from './DefinisciProcedimentoTheming.jsx';
import Paper from "@mui/material/Paper";
import { useTheme } from '@mui/material/styles';

const filter = createFilterOptions();

export default function SedeSelect({inputWidth, minWidth, maxWidth, backgroundColor, margin, labelColor, onChange, currValue}) {
  const [value, setValue] = React.useState(currValue ? {sede: currValue} : null);
  const [open, toggleOpen] = React.useState(false);
  const theme = useTheme()

  const handleClose = () => {
    setDialogValue({
      sede: '',
    });
    toggleOpen(false);
  };

  const [dialogValue, setDialogValue] = React.useState({
    sede: '',
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    setValue({
      sede: dialogValue.sede,
    });
    onChange({sede: dialogValue.sede})
    handleClose();
  };

  return (
    <React.Fragment>
      <Autocomplete
        value={value}
        onChange={(event, newValue) => {
          if (typeof newValue === 'string') {
            // timeout to avoid instant validation of the dialog's form.
            setTimeout(() => {
              toggleOpen(true);
              setDialogValue({
                sede: newValue.toLocaleUpperCase(),
              });
            });
          } else if (newValue && newValue.inputValue) {
            toggleOpen(true);
            setDialogValue({
              sede: newValue.inputValue,
            });
          } else {
            setValue(newValue);
            if(onChange) onChange(newValue)
          }
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);

          if (params.inputValue !== '') {
            filtered.push({
              inputValue: params.inputValue.toLocaleUpperCase(),
              sede: `Aggiungi "${params.inputValue.toLocaleUpperCase()}"`,
            });
          }

          return filtered;
        }}
        id="sede-select"
        options={sedi}
        getOptionLabel={(option) => {
          // e.g. value selected with enter, right from the input
          if (typeof option === 'string') {
            return option;
          }
          if (option.inputValue) {
            return option.inputValue;
          }
          return option.sede;
        }}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        PaperComponent={({ children }) => (
          <Paper sx={{backgroundColor: theme.palette.dropdown.primary}}>{children}</Paper>
        )}
        renderOption={(props, option) => 
          <li {...props} 
          
          style={{color: theme.palette.primary.main, fontSize: '.9rem', fontWeight:'400'}}>
                {option.sede}
          </li>
        }
        sx={{
          margin: margin,
          width: inputWidth, 
          minWidth: minWidth, 
          maxWidth: maxWidth, 
          backgroundColor: backgroundColor, 
          display:'inline-block', 
        }}
        freeSolo
        renderInput={(params) => 
          <CssTextField {...params} 
          label="Sede" 
          size='small'
          sx={{'& .MuiOutlinedInput-input':{fontWeight: '500'}, '& .MuiFormLabel-root':{color: labelColor}, }}
          />
        }
      />
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Nuova sede</DialogTitle>
          <DialogContent>
            <DialogContentText>
            Vuoi aggiungere una nuova sede alla lista ?
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              value={dialogValue.sede}
              onChange={(event) =>
                setDialogValue({
                  ...dialogValue,
                  sede: event.target.value,
                })
              }
              label="Sede"
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

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const sedi = [
  { sede: 'NOLA'},
  { sede: 'MEDARB'},
  { sede: 'NAPOLI 3'},
];

/**
 * Function to convert into camel Case
 * @param {string} str Stringa
 * @returns Stringa camelCase
 */
function camelCase(str) {
    return str.substring(0,1).toLocaleUpperCase() + str.substring(1)
}