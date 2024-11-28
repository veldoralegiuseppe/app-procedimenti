import * as React from 'react';
import {FormContainer} from '@shared/components';
import { SEZIONI } from '@features/procedimento';

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
