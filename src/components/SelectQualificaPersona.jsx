import * as React from 'react';
import { CssTextField, labelColor } from '@theme/MainTheme';
import { styled } from '@mui/system';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { Button, Divider } from '@mui/material';
import Popper from '@mui/material/Popper';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';

const filter = createFilterOptions();

const StyledPopper = styled((props) => <Popper {...props} />)(({ theme }) => ({
  '& .MuiPaper-root': {
    backgroundColor: theme.palette.dropdown.primary,
    maxHeight: '200px',
    overflowY: 'auto',
  },
  '& .MuiMenuItem-root': {
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.dropdown.primary,
    '&:hover': {
      backgroundColor: theme.palette.dropdown.hover,
      color: theme.palette.primary.main,
    },
    '&.Mui-selected': {
      backgroundColor: theme.palette.dropdown.hover,
      color: theme.palette.primary.main,
    },
    '&.Mui-selected:hover': {
      backgroundColor: theme.palette.dropdown.hover,
      color: theme.palette.primary.main,
    },
  },
}));

export default function SelectQualificaPersona({ label, onChange, options, sx }) {
  const theme = useTheme();
  const [value, setValue] = React.useState(null);
  const [open, toggleOpen] = React.useState(false);
  const [dialogValue, setDialogValue] = React.useState({
    maschile: '',
    femminile: '',
  });

  const handleChange = (event, newValue) => {
    if (typeof newValue === 'string') {
      setTimeout(() => {
        const isFemminile = newValue.endsWith('A');
        toggleOpen(true);
        setDialogValue({
          maschile: !isFemminile ? newValue : '',
          femminile: isFemminile ? newValue : '',
          isFemminile,
        });
      });
    } else if (newValue && newValue.inputValue) {
      setTimeout(() => {
        const isFemminile = newValue.inputValue.endsWith('A');
        console.log('isFemminile', isFemminile);
        toggleOpen(true);
        setDialogValue({
          maschile: !isFemminile ? newValue.inputValue : '',
          femminile: isFemminile ? newValue.inputValue : '',
          isFemminile,
        });
      });
    } else {
      setValue(newValue);
    }
    if (onChange) {
      onChange(newValue);
    }
  };

  const filterOptions = (options, params) => {
    const filtered = filter(options, params);
    const { inputValue } = params;
    const isExisting = options.some((option) =>
      Object.values(option).some((value) => {
        return value.toLowerCase().includes(inputValue.toLowerCase());
      })
    );
    if (inputValue !== '' && !isExisting) {
      filtered.push({ title: `Aggiungi "${inputValue}"` });
    }
    return filtered;
  };

  const getOptionLabel = (option) => {
    if (typeof option === 'string') return option;
    if (option.inputValue) return option.inputValue;
    return Object.values(option).join(' ') || '';
  };

  const handleClose = () => {
    setDialogValue({
      maschile: '',
      femminile: '',
    });
    toggleOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setValue(
      dialogValue.isFemminile ? dialogValue.femminile : dialogValue.maschile
    );
    handleClose();
  };

  const handleButtonClick = (value) => {
    console.log('handleButtonClick', value);
    if (String(value).toLocaleLowerCase().includes('aggiungi')) {
      const sanitizedValue = String(value)
        .replace('Aggiungi "', '')
        .replace('"', '')
        .trim()
        .toUpperCase();
      handleChange(null, { inputValue: sanitizedValue });
      return;
    }
    const newValue = { label: value };
    setValue(newValue);
    if (onChange) onChange(newValue);
    document.activeElement.blur(); // Close the popper by blurring the input
  };

  return (
    <React.Fragment>
      <Autocomplete
        value={value}
        onChange={handleChange}
        filterOptions={filterOptions}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        id="multi-select"
        options={options || []}
        getOptionLabel={getOptionLabel}
        renderOption={(props, option) => (
          <li
            {...props}
            style={{ backgroundColor: 'transparent', padding: '0' }}
            key={'li-' + JSON.stringify(option)}
            onClick={(event) => event.preventDefault()}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                justifyContent: 'space-evenly',
              }}
            >
              {Object.entries(option).map(([key, value], subIndex) => (
                <React.Fragment key={`${key}-${value}-${subIndex}`}>
                  <Button
                    variant="text"
                    sx={{
                      width: '100%',
                      '&:hover': {
                        backgroundColor: theme.palette.dropdown.hover, // Colore di sfondo su hover
                        color: theme.palette.primary.main, // Colore del testo su hover
                      },
                    }}
                    onClick={() => handleButtonClick(value)}
                  >
                    {value}
                  </Button>
                  {subIndex < Object.keys(option).length - 1 && (
                    <Divider orientation="vertical" flexItem />
                  )}
                </React.Fragment>
              ))}
            </div>
          </li>
        )}
        sx={{ width: 300, ...sx }}
        PopperComponent={(props) => <StyledPopper {...props} />}
        PaperComponent={(props) => (
          <Paper {...props} sx={{ bgcolor: theme.palette.dropdown.primary }} />
        )}
        freeSolo
        renderInput={(params) => (
          <CssTextField
            {...params}
            sx={{
              '& .MuiInput-underline:before': {
                borderBottomColor: theme.palette.primary.main, // Colore principale del theme
              },
              '& .MuiInput-underline:hover:before': {
                borderBottomColor: theme.palette.primary.main, // Colore principale del theme su hover
              },
              '& .MuiInput-underline:after': {
                borderBottomColor: theme.palette.primary.main, // Colore principale del theme dopo il focus
              },
            }}
            size="small"
            label={label}
          />
        )}
      />
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Crea</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Aggiungi un titolo professionale o di cortesia mancante
            </DialogContentText>
            <CssTextField
              autoFocus
              margin="dense"
              id="input-text-maschile"
              value={dialogValue.maschile}
              onChange={(event) => {
                event.target.value = String(event.target.value).toUpperCase();
                setDialogValue({
                  ...dialogValue,
                  maschile: event.target.value,
                });
              }}
              label="Maschile"
              type="text"
              variant="standard"
              sx={{
                margin: '1.5rem 0 0 0',
                '& .MuiInput-underline:before': {
                  borderBottomColor: labelColor, 
                },
                '& .MuiInput-underline:hover:before': {
                  borderBottomWidth: '1px',
                  borderBottomColor: theme.palette.primary.main + ' !important', 
                },
              }}
            />
            <CssTextField
              margin="dense"
              id="input-text-femminile"
              value={dialogValue.femminile}
              onChange={(event) => {
                event.target.value = String(event.target.value).toUpperCase();
                setDialogValue({
                  ...dialogValue,
                  femminile: event.target.value,
                });
              }}
              label="Femminile"
              type="text"
              variant="standard"
              sx={{
                margin: '1.5rem 0 0 1rem',
                '& .MuiInput-underline:before': {
                  borderBottomColor: labelColor, 
                },
                '& .MuiInput-underline:hover:before': {
                  borderBottomWidth: '1px',
                  borderBottomColor: theme.palette.primary.main + ' !important', 
                },
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Annulla</Button>
            <Button type="submit">Aggiungi</Button>
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  );
}
