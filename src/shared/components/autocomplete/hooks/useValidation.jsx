import { useState } from 'react';
import { validators } from '@utils';

export const useValidation = (optionModel) => {
  const [isFormValid, setIsFormValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const validateInput = (input, validations) => {
    //console.log('validations', validations);
    const validationsResult =
      validations
        ?.filter((modelKey) => optionModel?.includes(modelKey))
        ?.map((validation) => validators[validation]?.(input))
        .filter((result) => result !== true) || [];

    //console.log('validationsResult', validationsResult);
    const updatedIsFormValid = validationsResult.length === 0;
    const updatedErrorMessage =
      validationsResult.length === 0 ? '' : validationsResult[0];

    setIsFormValid(updatedIsFormValid);
    setErrorMessage(updatedErrorMessage);
    return {
      isFormValid: updatedIsFormValid,
      errorMessage: updatedErrorMessage,
    };
  };

  return { isFormValid, errorMessage, validateInput };
};
