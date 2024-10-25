import * as React from 'react';
import { fontSize, styled, useTheme } from '@mui/system';
import {
  Autocomplete,
  Popper,
  Paper,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PropTypes from 'prop-types';
import { CssTextField, labelColor } from '@theme/MainTheme';

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

export default function SelectQualificaPersona({
  label,
  onChange,
  onSubmit,
  onDelete,
  options: items,
  sx,
  value: initialValue = null,
  error = false,
  helperText = '',
}) {
  // Style
  const theme = useTheme();

  // State
  const [open, toggleOpen] = React.useState(false);
  const [value, setValue] = React.useState(initialValue);
  const [options, setOptions] = React.useState(items || []);
  const [dialogValue, setDialogValue] = React.useState({
    maschile: '',
    femminile: '',
  });

  // Ref
  const maschileInputRef = React.useRef(null);
  const femminileInputRef = React.useRef(null);

  // Use Effect
  React.useEffect(() => {
    setOptions(items);
  }, [items]);

  // Handlers
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
        toggleOpen(true);
        setDialogValue({
          maschile: !isFemminile ? newValue.inputValue : '',
          femminile: isFemminile ? newValue.inputValue : '',
          isFemminile,
        });
      });
    }
    if (!newValue) {
      document.activeElement.blur(); // Close the popper by blurring the input
    }
    if (onChange) {
      setValue(newValue ? newValue : null);
      onChange({ target: { value: newValue ? newValue : undefined } });
    }
  };
  const filterOptions = (options, { inputValue }) => {
    const optionsFiltered = options.filter(
      (option) =>
        option.maschile.toLowerCase().includes(inputValue.toLowerCase()) ||
        option.femminile?.toLowerCase().includes(inputValue.toLowerCase())
    );

    if (optionsFiltered.length == 0 && inputValue != '') {
      optionsFiltered.push({ title: `Aggiungi "${inputValue}"` });
    }

    return optionsFiltered;
  };
  const getOptionLabel = (option) => {
    if (typeof option === 'string') return option;
    if (option.inputValue) return option.inputValue;
    return Object.values(option).join(' ') || '';
  };
  const handleClose = (clearValue) => {
    setDialogValue({
      maschile: '',
      femminile: '',
    });
    if (clearValue) setValue(null);
    if (onChange) onChange({ target: { value: undefined } });
    toggleOpen(false);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const newValue = {
      maschile: dialogValue.maschile,
      femminile: dialogValue.femminile,
    };

    const value = dialogValue.isFemminile
      ? dialogValue.femminile || dialogValue.maschile
      : dialogValue.maschile || dialogValue.femminile;
    setValue(value);

    if (onSubmit) onSubmit(newValue);
    handleClose(false);
  };
  const handleButtonClick = (value) => {
    if (String(value).toLocaleLowerCase().includes('aggiungi')) {
      const sanitizedValue = String(value)
        .replace('Aggiungi "', '')
        .replace('"', '')
        .trim()
        .toUpperCase();
      setValue(sanitizedValue);
      handleChange(null, { inputValue: sanitizedValue });
      return;
    }
    const newValue = value ? value : undefined;
    setValue(value);
    if (onChange) onChange({ target: { value: newValue } });
    document.activeElement.blur(); // Close the popper by blurring the input
  };
  const handleDelete = (option) => {
    if (value && (option.maschile === value || option.femminile === value)) {
      setValue(null);
      if (onChange) onChange({ target: { value: undefined } });
    }
    if (onDelete) onDelete(option);
  };

  // Render utils
  const renderGroup = (params) => {
    //console.log('params', /{"title":"Aggiungi/.test(params.children[0].key));
    const hasFilteredOptions = !/{"title":"Aggiungi/.test(
      params.children[0].key
    );

    return (
      <li key={params.key}>
        {hasFilteredOptions && (
          <div
            style={{
              backgroundColor: '#e67a0fb3', // Cambiato da primary a secondary
              padding: '4px 16px',
              fontWeight: '500',
              fontFamily: 'Montserrat, sans-serif',
              color: '#ffffff', // Colore del testo cambiato a bianco per migliorare la leggibilità
            }}
          >
            {params.group}
          </div>
        )}
        <ul style={{ padding: 0 }}>{params.children}</ul>
      </li>
    );
  };

  return (
    <React.Fragment>
      <Autocomplete
        value={value}
        onChange={handleChange}
        groupBy={(option) =>
          option.femminile ? 'Genere Specifico' : 'Genere Comune'
        }
        filterOptions={filterOptions}
        selectOnFocus
        clearOnBlur
        disableClearable={!value}
        id="qualifica-select"
        options={
          options.sort((a, b) => {
            if (a.femminile && !b.femminile) return 1;
            if (!a.femminile && b.femminile) return -1;
            return a.maschile.localeCompare(b.maschile);
          }) || []
        }
        getOptionLabel={getOptionLabel}
        renderGroup={renderGroup}
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
                <React.Fragment key={`${key}-${value}-${subIndex}-container`}>
                  {key == 'maschile' && value && (
                    <IconButton
                      onClick={() => handleDelete(option)}
                      aria-label="delete"
                      sx={{ fontSize: '1rem', color: '#e67a0fb3' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                  <React.Fragment key={`${key}-${value}-${subIndex}-fragment`}>
                    {value && (
                      <Button
                        variant="text"
                        sx={{
                          width: '100%',
                          margin: '0 .5rem',
                          '&:hover': {
                            backgroundColor: theme.palette.dropdown.hover, // Colore di sfondo su hover
                            color: theme.palette.primary.main, // Colore del testo su hover
                          },
                        }}
                        onClick={() => handleButtonClick(value)}
                      >
                        {value}
                      </Button>
                    )}
                    {subIndex < Object.keys(option).length - 1 && value && (
                      <Divider
                        orientation="vertical"
                        variant="middle"
                        flexItem
                      />
                    )}
                  </React.Fragment>
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
            error={error}
            helperText={error ? helperText || '' : ''}
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
        <form>
          <DialogTitle>Crea</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Aggiungi un titolo professionale o di cortesia mancante
            </DialogContentText>
            <CssTextField
              ref={maschileInputRef}
              error={!dialogValue.maschile}
              helperText={!dialogValue.maschile ? 'Campo obbligatorio' : ''}
              autoFocus
              required
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
              ref={femminileInputRef}
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
            <Button onClick={() => handleClose(true)}>Annulla</Button>
            <Button
              disabled={!dialogValue.maschile}
              onClick={handleSubmit}
              type="submit"
            >
              Aggiungi
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  );
}

SelectQualificaPersona.propTypes = {
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      maschile: PropTypes.string,
      femminile: PropTypes.string,
    })
  ).isRequired,
  sx: PropTypes.object,
};
