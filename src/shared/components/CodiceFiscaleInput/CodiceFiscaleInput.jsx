import React from 'react';
import { TextField } from '@shared/components';
import { useCodiceFiscale } from '@shared/hooks';

const CodiceFiscaleInput = ({
  inputValidations: initValidations = [],
  ...props
}) => {
  const { isValid: cfValidation, getLuogoNascita, decode } = useCodiceFiscale();

  const inputValidations = [...initValidations, cfValidation];

  return <TextField {...props} inputValidations={inputValidations} />;
};

export default CodiceFiscaleInput;
