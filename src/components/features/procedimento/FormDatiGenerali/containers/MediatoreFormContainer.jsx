import * as React from 'react';
import FormContainer from '@components/commons/FormContainer/FormContainer';
import { SEZIONI } from '@model/procedimento';

const MediatoreFormContainer = ({ config = {} }) => {
 
  const configOverride = {
    ...config
  };

  return (
    <FormContainer
      config={configOverride}
      sezioni={[SEZIONI.MEDIATORE]}
    />
  );
};

export default MediatoreFormContainer;
