import { CssTextField } from '@ui-shared/theme';

import React from 'react';
import _ from 'lodash';

const TextField = ({
  label,
  value,
  onChange,
  helperText,
  error,
  onBlur,
  disabled,
  sx,
  inputSize= 'small',
  multiline = false,
  required = false,
  rows,
}) => {

  console.log('TextField', label, multiline, rows)
  const [localValue, setLocalValue] = React.useState(value || '');

  React.useEffect(() => {
    if(_.isEqual(value, localValue)) return;
    setLocalValue(value || '');
  }, [value]);

  const handleChange = React.useMemo(() => (e) => {
    setLocalValue(e.target.value || '');
    onChange?.(e);
  }, [onChange])

  const handleBlur = React.useMemo(() => (e) => {
    const debouncedOnBlur = _.debounce(() => onBlur(e), 80);
    setLocalValue(() => {
      debouncedOnBlur();
      return e.target.value;
    })
  }, [onBlur])

  return (
    <CssTextField
      label={label}
      value={localValue}
      disabled={disabled}
      error={error}
      multiline={multiline}
      rows={rows}
      required={required}
      sx={sx}
      size={inputSize}
      helperText={helperText}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );
};

export default TextField;
