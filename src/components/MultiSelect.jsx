import * as React from 'react';
import { CssTextField } from '@theme/MainTheme';
import { styled } from '@mui/system';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { Button, Divider } from '@mui/material';
import Popper from '@mui/material/Popper';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';

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

export default function MultiSelect({ label, onChange, options, sx }) {
  const theme = useTheme();
  const [value, setValue] = React.useState(null);

  const handleChange = (event, newValue) => {
    if (typeof newValue === 'string') {
      setValue({ label: newValue });
    } else if (newValue && newValue.inputValue) {
      setValue({ label: newValue.inputValue });
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

const handleButtonClick = (value) => {
    const newValue = { label: value };
    setValue(newValue);
    if (onChange) onChange(newValue);
    document.activeElement.blur(); // Close the popper by blurring the input
};

  return (
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
      sx={{ width: 300 }}
      PopperComponent={(props) => <StyledPopper {...props} />}
      PaperComponent={(props) => (
        <Paper {...props} sx={{ bgcolor: theme.palette.dropdown.primary }} />
      )}
      freeSolo
      renderInput={(params) => (
        <CssTextField {...params} sx={{ ...sx }} size="small" label={label} />
      )}
    />
  );
}
