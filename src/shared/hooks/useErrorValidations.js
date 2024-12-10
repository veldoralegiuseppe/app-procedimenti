import { useState, useCallback } from 'react';

const useErrorValidations = (validations) => {
  const [errors, setErrors] = useState({});

  const validate = useCallback(
    (value) => {
      const newErrors = validations.reduce((acc, validation) => {
        const errorMessage = validation(value);
        if (typeof errorMessage === 'string') {
          acc[validation.name] = errorMessage;
        }
        return acc;
      }, {});

      setErrors(newErrors);
    },
    [validations]
  );

  return { errors, validate };
};

export default useErrorValidations;
