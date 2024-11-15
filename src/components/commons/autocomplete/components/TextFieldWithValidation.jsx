import React, { useEffect } from 'react';
import { CssTextField } from '@theme/MainTheme';
import { useValidation } from '../hooks/useValidation';

const TextFieldWithValidation = ({
  label,
  value = '',
  validations,
  onValueChange,
}) => {
 
  const {
    isFormValid: isInputValid,
    errorMessage,
    validateInput,
  } = useValidation();

  useEffect(() => {
    const { isFormValid: isValid } = validateInput(value, validations);
    onValueChange(value, isValid);
  }, []);

  const handleChange = (event) => {
    const upperCaseValue = event.target.value.toUpperCase();
    const { isFormValid: isValid } = validateInput(upperCaseValue, validations);
    onValueChange(upperCaseValue, isValid);
  };

  return (
    <CssTextField
      key={`${label}-text-field`}
      error={!isInputValid}
      helperText={!isInputValid ? errorMessage : ''}
      autoFocus
      required={validations?.includes('required')}
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
