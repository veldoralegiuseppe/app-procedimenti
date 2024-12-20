import * as React from 'react';
import { CssTextField } from '@shared/theme';

const TextFieldWithValidation = ({
  label,
  value,
  error,
  helperText,
  required,
  onValueChange,
}) => {

  const handleChange = (event) => {
    const upperCaseValue = event.target.value.toUpperCase();
    onValueChange(upperCaseValue);
  };

  return (
    <CssTextField
      key={`${label}-text-field`}
      error={error}
      helperText={helperText || ''}
      autoFocus
      required={required}
      margin="dense"
      id={`${label}-text-field`}
      value={value}
      onChange={handleChange}
      label={label}
      type="text"
      variant="standard"
      size="small"
    />
  );
};

export default TextFieldWithValidation;
