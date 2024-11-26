import * as React from 'react';
import FormContainer from '@components/commons/FormContainer/FormContainer';
import { SEZIONI } from '@model/Procedimento/procedimento';

const MediatoreFormContainer = ({ config = {}, procedimentoStore }) => {
 
  const configOverride = {
    ...config
  };

  return (
    <FormContainer
      config={configOverride}
      sezioni={[SEZIONI.MEDIATORE]}
      store={procedimentoStore}
    />
  );
};

export default MediatoreFormContainer;
