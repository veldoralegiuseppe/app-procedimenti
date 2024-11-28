import React from 'react';
import { Autocomplete, Paper, Popper } from '@mui/material';
import OptionItem from './OptionItem';
import { CssTextField } from '@shared/theme';
import { styled, useTheme } from '@mui/system';

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

const AutocompleteWrapper = ({
  label,
  value,
  options,
  handleChange,
  onBlur,
  onDelete,
  sx,
  error,
  helperText,
  groupBy,
  filterOptions,
  onOptionSelected,
}) => {
  const theme = useTheme();

  const renderGroup = (params) => {
    const hasFilteredOptions = params.children[0].props.option.key !== 'add';
  
    return (
      <li key={params.key || 'default-group-key'}>
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
        <ul key={`ul-${params.key}`} style={{ padding: 0 }}>
          {React.Children.map(params.children, (child, index) =>
            React.cloneElement(child, { key: `${params.key}-${index}` })
          )}
        </ul>
      </li>
    );
  };

  const getOptionLabel = (option) => {
    if (typeof option === 'string') return option;
    if (option.inputValue) return option.inputValue;
    return option?.label || '';
  };

  return (
    <Autocomplete
      value={value}
      onChange={(event, value, reason) => handleChange(event, null, value, reason)}
      filterOptions={filterOptions}
      groupBy={groupBy}
      onBlur={(e) => onBlur(value ? value.toUpperCase() : undefined)}
      selectOnFocus
      clearOnBlur
      disableClearable={!value}
      id={`${label}-autocomplete`}
      options={options || []}
      getOptionLabel={getOptionLabel}
      renderGroup={renderGroup}
      renderOption={(props, option, index) => (
        <OptionItem
          {...props}
          key={`${JSON.stringify(option.value) || 'defaultValue'}-${
            option.label || 'defaultLabel'
          }-${index}`}
          option={option}
          onDelete={onDelete}
          onOptionSelected={onOptionSelected}
        />
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
          value={value?.value || ''}
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
  );
};

export default AutocompleteWrapper;
