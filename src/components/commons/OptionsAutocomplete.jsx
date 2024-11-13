import * as React from 'react';
import { styled, useTheme } from '@mui/system';
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
import {validators} from '@utils/validators';

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

/**
 * Componente OptionsAutocomplete
 * 
 * @param {Object} props - Proprietà del componente
 * @param {string} props.label - Etichetta del campo di input
 * @param {function} props.onChange - Funzione chiamata al cambiamento del valore
 * @param {function} props.onSubmit - Funzione chiamata alla sottomissione del dialog
 * @param {function} props.onDelete - Funzione chiamata alla cancellazione di un'opzione
 * @param {Array} props.options - Lista delle opzioni disponibili
 * @param {Object} props.sx - Stili aggiuntivi per il componente
 * @param {string|null} [props.value=null] - Valore iniziale del campo di input
 * @param {boolean} [props.error=false] - Indica se c'è un errore nel campo di input
 * @param {string} [props.helperText=''] - Testo di aiuto mostrato in caso di errore
 * @param {string} [props.dialogDescriptionText=''] - Testo descrittivo del dialog
 * @param {string} [props.dialogTitle='Crea'] - Titolo del dialog
 * @param {function} props.valueFormat - Funzione per formattare il valore visualizzato
 * @param {function} props.groupBy - Funzione per raggruppare le opzioni (le opzioni devono essere ordinate per gruppi)
 * @param {function} props.filterOptions - Funzione per filtrare le opzioni
 * @param {React.Element} props.dialogForm - Form personalizzato per il dialog
 * 
 * @returns {React.Element} - Componente OptionsAutocomplete
 */
const OptionsAutocomplete = ({
  label,
  onChange,
  onSubmit,
  onDelete,
  options: items,
  sx,
  value: initialValue = null,
  error = false,
  helperText = '',
  dialogDescriptionText = '',
  dialogTitle = 'Crea',
  valueFormat,
  groupBy,
  filterOptions: filterOptionsProp,
  dialogForm,
}) => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(initialValue);
  const [options, setOptions] = React.useState(items || []);
  const [dialogValue, setDialogValue] = React.useState({});
  const [isFormValid, setIsFormValid] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  React.useEffect(() => {
    setOptions(items);
  }, [items]);

  const handleChange = (event, newValue) => {
    if (typeof newValue === 'string' || (newValue && newValue.inputValue)) {
      const value = (newValue.inputValue || newValue).toUpperCase()
      console.log('open dialog', value);
      setOpen(true);
      setDialogValue({value: value,});

      const errorMessage = validators.onlyAlphanumeric(value);
      setIsFormValid(errorMessage === true);
      setErrorMessage(errorMessage !== true ? errorMessage : null);
    } else {
      setValue(newValue?.value ?? null);
      onChange?.({ target: { value: newValue?.value ?? undefined } });
    }
  };

  const filterOptions = (options, { inputValue }) => {
    const filteredOptions = filterOptionsProp
      ? filterOptionsProp(options, inputValue)
      : options.filter((option) =>
          option.value?.toUpperCase().includes(inputValue.toUpperCase())
        );

    if (filteredOptions.length === 0 && inputValue) {
      filteredOptions.push({
        key: 'add',
        value: inputValue,
        label: `Aggiungi "${inputValue}"`,
      });
    }

    return filteredOptions;
  };

  const getOptionLabel = (option) => {
    if (typeof option === 'string') return option;
    if (option.inputValue) return option.inputValue;
    return option?.label || '';
  };

  const handleClose = (clearValue) => {
    setOpen(false);
    if (clearValue) setValue(null);
    onChange?.({ target: { value: undefined } });

    // Per evitare di avere errori nella form durante la chiusura del dialog
    setTimeout(() => {
      setDialogValue({ value: '' });
    }, 300);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('submit', dialogValue);
    const newValue = dialogValue.value || '';
    console.log('newValue', newValue);
    setValue(newValue);
    onSubmit?.(dialogValue);
    handleClose(false);
  };

  const handleButtonClick = (option, value) => {
    if (option.key === 'add') {
      setValue(option.value);
      handleChange(null, { inputValue: option.value });
    } else {
      setValue(value ?? null);
      onChange?.({ target: { value: value ?? undefined } });
      document.activeElement.blur();
    }
  };

  const handleDelete = (option) => {
    console.log('ripulisco il value', value);
    if (value && (option === value || option.value === value || typeof option === 'object' && Object.values(option.value).includes(value))) {
      setValue(null);
      onChange?.({ target: { value: undefined } });
    }
    console.log('onDelete', option);
    onDelete?.(option);
  };

  const renderGroup = (params) => {
    const hasFilteredOptions = !String(params.children[0].key).includes('key');
    
    console.log('params', params);
    return (
      <li key={params.key}>
        {hasFilteredOptions && (
          <div
            style={{
              backgroundColor: '#e67a0fb3',
              padding: '4px 16px',
              fontWeight: '500',
              fontFamily: 'Montserrat, sans-serif',
              color: '#ffffff',
            }}
          >
            {params.group}
          </div>
        )}
        <ul style={{ padding: 0 }}>{params.children}</ul>
      </li>
    );
  };

  const handleFormValidityChange = React.useCallback((isValid) => {
    setIsFormValid(isValid);
  }, []);

  return (
    <React.Fragment>
      <Autocomplete
        value={typeof value === 'string' ? value : valueFormat?.(value) || ''}
        onChange={handleChange}
        filterOptions={filterOptions}
        groupBy={groupBy}
        selectOnFocus
        clearOnBlur
        disableClearable={!value}
        id={`${label}-autocomplete`}
        options={options || []}
        getOptionLabel={getOptionLabel}
        renderGroup={renderGroup}
        renderOption={(props, option) => (
          <li
            {...props}
            style={{ backgroundColor: 'transparent', padding: '0' }}
            key={`li-${JSON.stringify(option)}`}
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
              {/* Icona di eliminazione se l'opzione non è "add" e ha un valore */}
              {option.key !== 'add' && option.value && (
                <IconButton
                  onClick={() => handleDelete(option)}
                  aria-label="delete"
                  sx={{ fontSize: '1rem', color: '#e67a0fb3' }}
                >
                  <DeleteIcon />
                </IconButton>
              )}

              {/* Rendering condizionale dei bottoni in base al tipo di `value` */}
              {typeof option.value === 'object' && option.value !== null
                ? // Se `value` è un oggetto, crea un `Button` per ciascuna proprietà
                  Object.entries(option.value).map(
                    ([subKey, subValue], subIndex) => (
                      <React.Fragment key={`${subKey}-${subValue}-${subIndex}`}>
                        <Button
                          variant="text"
                          sx={{
                            width: '100%',
                            margin: '0 .5rem',
                            '&:hover': {
                              backgroundColor: theme.palette.dropdown.hover,
                              color: theme.palette.primary.main,
                            },
                          }}
                          onClick={() => handleButtonClick(option, subValue)}
                        >
                          {subValue}
                        </Button>
                        {/* Divider per separare i bottoni, ma non dopo l'ultimo */}
                        {subIndex < Object.keys(option.value).length - 1 && (
                          <Divider
                            orientation="vertical"
                            variant="middle"
                            flexItem
                          />
                        )}
                      </React.Fragment>
                    )
                  )
                : // Se `value` è una stringa semplice, mostra un singolo `Button`
                  option.value && (
                    <Button
                      variant="text"
                      sx={{
                        width: '100%',
                        margin: '0 .5rem',
                        '&:hover': {
                          backgroundColor: theme.palette.dropdown.hover,
                          color: theme.palette.primary.main,
                        },
                      }}
                      onClick={() => handleButtonClick(option)}
                    >
                      {option.label || option.value}
                    </Button>
                  )}
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
            value={valueFormat?.(value) || value?.value || ''}
            error={error}
            helperText={error ? helperText || '' : ''}
            sx={{
              '& .MuiInput-underline:before': {
                borderBottomColor: theme.palette.primary.main,
              },
              '& .MuiInput-underline:hover:before': {
                borderBottomColor: theme.palette.primary.main,
              },
              '& .MuiInput-underline:after': {
                borderBottomColor: theme.palette.primary.main,
              },
            }}
            size="small"
            label={label}
          />
        )}
      />
      <Dialog open={open} onClose={handleClose}>
        <form>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogContent>
            <DialogContentText>{dialogDescriptionText}</DialogContentText>
            {dialogForm ? (
              React.cloneElement(dialogForm, {
                dialogValue,
                setDialogValue,
                onFormValidityChange: handleFormValidityChange,
              })
            ) : (
              <CssTextField
                error={!isFormValid}
                helperText={errorMessage}
                autoFocus
                required
                margin="dense"
                id="input-text-maschile"
                value={dialogValue.value || ''}
                onChange={(event) => {
                  const upperCaseValue = event.target.value.toUpperCase();
                  const errorMessage = typeof validators.required(upperCaseValue) === 'string' ? validators.required(upperCaseValue) : validators.onlyAlphanumeric(upperCaseValue);
                  setIsFormValid(errorMessage === true);
                  setErrorMessage(errorMessage !== true ? errorMessage : null);
                  setDialogValue({ ...dialogValue, value: upperCaseValue });
                }}
                label={label || ''}
                type="text"
                variant="standard"
                sx={{
                  margin: '1.5rem 0 0 0',
                  '& .MuiInput-underline:before': {
                    borderBottomColor: labelColor,
                  },
                  '& .MuiInput-underline:hover:before': {
                    borderBottomWidth: '1px',
                    borderBottomColor: `${theme.palette.primary.main} !important`,
                  },
                }}
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleClose(true)}>Annulla</Button>
            <Button
              disabled={!isFormValid}
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
};

OptionsAutocomplete.propTypes = {
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  onDelete: PropTypes.func,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    })
  ).isRequired,
  sx: PropTypes.object,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  error: PropTypes.bool,
  helperText: PropTypes.string,
  dialogDescriptionText: PropTypes.string,
  dialogTitle: PropTypes.string,
  valueFormat: PropTypes.func,
  groupBy: PropTypes.func,
  filterOptions: PropTypes.func,
  dialogForm: PropTypes.element,
};

export default OptionsAutocomplete;
