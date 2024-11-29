import * as React from 'react';
import {FormContainer} from '@shared/components';
import {ModelFactory} from '@shared/factories';

const IncontroFormContainer = ({ config = {}, procedimentoStore }) => {
  const sezioneIncontro = ModelFactory.getMetadata('procedimento').enums.sezioni[FISSAZIONE_INCONTRO]

  const renderOverrides = {
    campi: {
      ...config?.renderOverrides?.campi,
    },
  };

  const configOverride = {
    ...config,
    renderOverrides,
  };

  return (
    <FormContainer
      config={configOverride}
      sezioni={[sezioneIncontro]}
      store={procedimentoStore}
    />
  );
};

export default IncontroFormContainer;
