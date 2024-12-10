import { useState } from 'react';
import { validators } from '@utils';
import { ValidationHooksTypes } from '@shared/metadata';

export const useValidation = () => {
  const [isFormValid, setIsFormValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const validateInput = (input, validations) => {
    const filteredValidations = validations?.filter(
      (validation) =>
        !Object.values(ValidationHooksTypes).includes(
          Object.keys(validation)[0]
        )
    );

    const validationsResult =
      filteredValidations
        //?.filter((modelKey) => optionModel?.includes(modelKey))
        ?.map((validation) => validators[validation]?.(input))
        .filter((result) => result !== true) || [];

    console.log('validationsResult', validationsResult);
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
