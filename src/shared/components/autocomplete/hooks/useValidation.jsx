import { useState } from 'react';
import { validators } from '@utils';

export const useValidation = () => {
  const [isFormValid, setIsFormValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const validateInput = (input, validations) => {
    const validationsResult = validations
      ?.map((validation) => validators[validation]?.(input))
      .filter((result) => result !== true) || [];
  
    const updatedIsFormValid = validationsResult.length === 0;
    const updatedErrorMessage = validationsResult.length === 0 ? '' : validationsResult[0];

    setIsFormValid(updatedIsFormValid);
    setErrorMessage(updatedErrorMessage);
    return { isFormValid: updatedIsFormValid, errorMessage: updatedErrorMessage };
  };

  return { isFormValid, errorMessage, validateInput };
};
