import * as React from 'react';
import { CssTextField } from '@shared/theme';
import { InputAdornment, IconButton } from '@mui/material';
import { ArrowDropUp, ArrowDropDown } from '@mui/icons-material';

export default function NumberInput({
  value = 0,
  onChange,
  label = '',
  min = 0,
  max = 100,
  sx,
}) {
  const [inputValue, setInputValue] = React.useState(value);

  React.useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <CssTextField
      label={label}
      type="text"
      variant="outlined"
      size="small"
      value={inputValue}
      onChange={(event) => {
        const newValue = event.target.value;
        const sanitizedValue = newValue.replace(/[^0-9]/g, '');
        if (
          sanitizedValue === '' ||
          isNaN(sanitizedValue) ||
          sanitizedValue < min ||
          sanitizedValue > max
        ) {
          event.target.value = sanitizedValue;
          return;
        }
      }}
      sx={{
        width: '5rem',
        //cursor: 'default',
        '& .MuiInputBase-input': {
          cursor: 'default',
          minWidth: '1.5rem',
        },
        ...sx,
      }}
      InputProps={{
        readOnly: true,

        endAdornment: (
          <InputAdornment
            sx={{
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              left: '2px',
              bottom: '1px',
              maxWidth: '2px',
            }}
            position="end"
          >
            <IconButton
              onClick={() => {
                const newValue = inputValue + 1 <= max ? inputValue + 1 : max;
                setInputValue(newValue);
                if (onChange) onChange(parseInt(newValue));
              }}
              sx={{ padding: 0, transform: ' translateY(-3px)' }}
            >
              <ArrowDropUp />
            </IconButton>
            <IconButton
              onClick={() => {
                const newValue = inputValue - 1 >= min ? inputValue - 1 : min;
                setInputValue(newValue);
                if (onChange) onChange(parseInt(newValue));
              }}
              sx={{ padding: 0, transform: ' translateY(-6px)' }}
            >
              <ArrowDropDown />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}
