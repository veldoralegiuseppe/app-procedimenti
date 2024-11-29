import * as React from 'react';
import {FormContainer} from '@shared/components';
import {ModelFactory} from '@shared/factories';

const MediatoreFormContainer = ({ config = {}, procedimentoStore }) => {
 
  const configOverride = {
    ...config
  };

  return (
    <FormContainer
      config={configOverride}
      sezioni={[ModelFactory.getMetadata('procedimento').enums.sezioni[MEDIATORE]]}
      store={procedimentoStore}
    />
  );
};

export default MediatoreFormContainer;
