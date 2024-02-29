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

export default function SedeSelect({inputWidth, minWidth, maxWidth, backgroundColor, margin}) {
  const [value, setValue] = React.useState(null);
  const [open, toggleOpen] = React.useState(false);
  const theme = useTheme()

  const handleClose = () => {
    setDialogValue({
      title: '',
      year: '',
    });
    toggleOpen(false);
  };

  const [dialogValue, setDialogValue] = React.useState({
    title: '',
    year: '',
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    setValue({
      title: dialogValue.title,
      year: parseInt(dialogValue.year, 10),
    });
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
                title: newValue.toLocaleUpperCase(),
                year: '',
              });
            });
          } else if (newValue && newValue.inputValue) {
            toggleOpen(true);
            setDialogValue({
              title: newValue.inputValue,
              year: '',
            });
          } else {
            setValue(newValue);
          }
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);

          if (params.inputValue !== '') {
            filtered.push({
              inputValue: params.inputValue.toLocaleUpperCase(),
              title: `Aggiungi "${params.inputValue.toLocaleUpperCase()}"`,
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
          return option.title;
        }}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        PaperComponent={({ children }) => (
          <Paper style={{ backgroundColor: theme.palette.primary.light}}>{children}</Paper>
        )}
        renderOption={(props, option) => <li {...props} style={{color: theme.palette.primary.main, fontSize: '.9rem', fontWeight:'500', }}>{option.title}</li>}
        sx={{margin: margin,width: inputWidth, minWidth: minWidth, maxWidth: maxWidth, backgroundColor: backgroundColor, display:'inline-block', '& .MuiAutocomplete-endAdornment':{top: '23%'},'& .MuiOutlinedInput-input':{fontWeight: '500'}}}
        freeSolo
        renderInput={(params) => <CssTextField {...params} label="Sede" size='small'/>}
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
              value={dialogValue.title}
              onChange={(event) =>
                setDialogValue({
                  ...dialogValue,
                  title: event.target.value,
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
  { title: 'NOLA'},
  { title: 'MEDARB'},
  { title: 'NAPOLI 3'},
];

/**
 * Function to convert into camel Case
 * @param {string} str Stringa
 * @returns Stringa camelCase
 */
function camelCase(str) {
    return str.substring(0,1).toLocaleUpperCase() + str.substring(1)
}