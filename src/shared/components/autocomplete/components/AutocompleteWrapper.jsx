import React from 'react';
import { Autocomplete, Paper, Popper } from '@mui/material';
import OptionItem from './OptionItem';
import { CssTextField } from '@shared/theme';
import { styled, useTheme } from '@mui/system';
import _ from 'lodash';

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
  '& .MuiAutocomplete-noOptions': {
    color: '#acaaaa',
    fontSize: '0.875rem',
  },
}));

const AutocompleteWrapperComponent = ({
  label,
  value,
  options,
  handleChange,
  onBlur,
  onOpen,
  loading,
  onDelete,
  sx,
  error,
  helperText,
  disabled,
  groupBy,
  filterOptions,
  onOptionSelected,
  deletable,
  freeSolo,
}) => {
  const theme = useTheme();

  const renderGroup = (params) => {
    const hasFilteredOptions = params.children[0].props.option.key !== 'add';
    console.log('renderGroup', params);

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
      onChange={(event, value, reason) =>
        handleChange(event, null, value, reason)
      }
      filterOptions={filterOptions}
      disabled={disabled}
      groupBy={groupBy}
      //onBlur={(e) => onBlur(value ? value.toUpperCase() : undefined)}
      selectOnFocus
      loadingText="Caricamento..."
      clearOnBlur
      onOpen={onOpen}
      disableClearable={!value}
      loading={loading}
      id={`${label}-autocomplete`}
      options={options || []}
      getOptionLabel={getOptionLabel}
      renderGroup={renderGroup}
      noOptionsText={'Nessuna opzione disponibile'}
      renderOption={(props, option) => (
        <OptionItem
          {...props}
          key={`${JSON.stringify(option.value) || 'defaultValue'}-${
            option.label || 'defaultLabel'
          }-${option.id}`}
          option={option}
          onDelete={onDelete}
          onOptionSelected={onOptionSelected}
          deletable={deletable}
        />
      )}
      sx={{
        width: 300,
        '& .MuiAutocomplete-endAdornment': freeSolo
          ? { marginTop: '0.5px' }
          : {},
        ...sx,
      }}
      PopperComponent={(props) => <StyledPopper {...props} />}
      PaperComponent={(props) => (
        <Paper {...props} sx={{ bgcolor: theme.palette.dropdown.primary }} />
      )}
      freeSolo={freeSolo}
      renderInput={(params) => (
        <CssTextField
          {...params}
          value={value?.value || ''}
          error={error}
          disabled={disabled}
          onKeyDown={(event) => {
            //console.log('onKeyDown', event);
            if (event.key === 'Enter') {
              event.preventDefault();
              event.stopPropagation();
            }
          }}
          helperText={helperText}
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

const AutocompleteWrapper = React.memo(
  AutocompleteWrapperComponent,
  (prevProps, nextProps) => {
    return (
      _.isEqual(prevProps.value === nextProps.value) &&
      _.isEqual(prevProps.options === nextProps.options) && 
      _.isEqual(prevProps.loading === nextProps.loading) && 
      _.isEqual(prevProps.helperText === nextProps.helperText) && 
      _.isEqual(prevProps.disabled === nextProps.disabled) 
    );
  }
);

AutocompleteWrapper.whyDidYouRender = true;
export default AutocompleteWrapper;
