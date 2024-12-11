import { useState, useCallback } from 'react';

const useErrorValidations = (onError = () => {}) => {
  const [errors, setErrors] = useState({});

  const hasErrors = (value, validations) => {
    const newErrors = validations.reduce((acc, validation) => {
      const errorMessage = validation(value);
      if (typeof errorMessage === 'string') {
        acc[validation.name] = errorMessage;
      }
      return acc;
    }, {});

    return newErrors;
  };

  const validate = useCallback(
    (value, validations) => {
      const newErrors = hasErrors(value, validations);
      console.log('newErrors', newErrors, value, validations);
      setErrors(() => {
        onError?.(newErrors);
        return newErrors;
      });
    },
    [onError]
  );

  const hasErrorWithCallback = useCallback((value, validations) => {
    const newErrors = hasErrors(value, validations);
    return newErrors;
  }, []);

  return { errors, setErrors, validate, hasErrors: hasErrorWithCallback };
};

export default useErrorValidations;
