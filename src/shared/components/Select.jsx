import React from 'react';
import {
  FormControl,
  InputLabel,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import {
  CssSelect,
  formControlStyles,
  labelColor as defaultLabelColor,
} from '@shared/theme';
import { ArrowDropDown as ArrowDropDownIcon, Close as CloseIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useErrorValidations } from '@shared/hooks';
import _ from 'lodash';

function Select({
  label,
  value = '',
  onChange,
  onBlur,
  onError,
  required = false,
  options = [],
  inputValidations = [],
  labelColor = defaultLabelColor,
  renderOptions,
  sx,
}) {
  // Style
  const theme = useTheme();
  const sxStyles = {
    ...formControlStyles(theme, labelColor),
    width: sx?.width || '100%',
    maxWidth: sx?.maxWidth || '30rem',
    minWidth: sx?.minWidth || '16.8rem',
    height: sx?.height || '34.13px',
    margin: sx?.margin || 0,
    '&:hover .MuiInputLabel-root:not(.Mui-disabled), &:hover .MuiSvgIcon-root, &:hover .MuiOutlinedInput-root fieldset':
      {
        color: theme.palette.logo.secondary, // Sincronizza colore su hover
        borderColor: theme.palette.logo.secondary, // Sincronizza il colore del bordo
      },
    '& .MuiInputLabel-root.Mui-focused': {
      color: theme.palette.logo.secondary, // Colore della label in focus
    },
    '& .MuiOutlinedInput-root.Mui-focused fieldset': {
      borderColor: theme.palette.logo.secondary, // Colore del bordo in focus
    },
    '& .MuiSvgIcon-root': {
      fill: labelColor, // Colore dell'icona di default
    },
    '& .MuiOutlinedInput-root:hover .MuiSvgIcon-root, & .MuiOutlinedInput-root.Mui-focused .MuiSvgIcon-root':
      {
        fill: theme.palette.logo.secondary, // Colore dell'icona su hover e focus
      },
  };

  // State
  const [selected, setSelected] = React.useState(value || '');
  const { errors, validate } = useErrorValidations(onError);

  // Effects
  React.useEffect(() => {
    if(_.isEqual(selected, value)) return;
    setSelected(value || '');
  }, [value]);

  // Handlers
  const handleClear = () => {
    setSelected('');
    onChange?.(undefined);
    onBlur?.(undefined);
  };
  const handleChange = (event) => {
    //console.log('Select.jsx handleChange event:', event);
    const value = event.target.value;
    setSelected(value);
    validate(value, inputValidations);
    if (onChange) onChange(event);
  };

  return (
    <FormControl
      required={required}
      size="small"
      sx={{ ...sxStyles, sx }}
      error={Object.keys(errors).length > 0}
    >
      <InputLabel
        id={`${label}-input-label`}
        error={Object.keys(errors).length > 0}
        sx={{ color: labelColor }}
      >
        {label}
      </InputLabel>

      <CssSelect
        labelId={`${label}-input-label`}
        value={selected}
        label={label}
        onBlur={(e) => {
          //console.log('Select.jsx onBlur e:', e, 'selected', selected);
          onBlur(selected || undefined)
        }}
        size="small"
        renderValue={(selected) =>
          (selected && String(selected).replaceAll('_', ' ')) || ''
        }
        onChange={handleChange}
        IconComponent={selected ? () => null : ArrowDropDownIcon}
        endAdornment={
          selected && (
            <CloseIcon onClick={handleClear} style={{ cursor: 'pointer' }} />
          )
        }
        MenuProps={{
          PaperProps: {
            sx: {
              bgcolor: theme.palette.dropdown.primary, // Sfondo delle opzioni
              maxHeight: options.length > 5 ? '200px' : 'auto', // Limita l'altezza per scroll quando ci sono più di 5 opzioni
            },
          },
          MenuListProps: {
            sx: {
              '& .MuiMenuItem-root': {
                color: theme.palette.primary.main, // Colore del testo delle opzioni
                bgcolor: theme.palette.dropdown.primary, // Sfondo predefinito delle opzioni
                '&:hover': {
                  bgcolor: theme.palette.dropdown.hover, // Sfondo su hover
                  color: theme.palette.primary.main, // Colore del testo su hover
                },
                '&.Mui-selected': {
                  bgcolor: theme.palette.dropdown.hover, // Sfondo quando un'opzione è selezionata
                  color: theme.palette.primary.main, // Colore del testo selezionato
                },
                '&.Mui-selected:hover': {
                  bgcolor: theme.palette.dropdown.hover, // Sfondo mantenuto su hover quando selezionato
                  color: theme.palette.primary.main, // Colore del testo su hover quando selezionato
                },
              },
            },
          },
        }}
      >
        {options.map((option, index) => (
          <MenuItem key={`${label}-item-${index}`} value={option}>
            {(renderOptions && renderOptions(option)) ||
              option.replaceAll('_', ' ')}
          </MenuItem>
        ))}
      </CssSelect>

      <FormHelperText error={Object.keys(errors).length > 0}>{Object.values(errors)[0] || ''}</FormHelperText>
    </FormControl>
  );
}

export default Select;
