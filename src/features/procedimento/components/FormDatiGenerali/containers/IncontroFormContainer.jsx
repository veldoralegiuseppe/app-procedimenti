import * as React from 'react';
import {FormContainer} from '@shared/components';
import { SEZIONI } from '@features/procedimento';

const IncontroFormContainer = ({ config = {}, procedimentoStore }) => {
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
      sezioni={[SEZIONI.FISSAZIONE_INCONTRO]}
      store={procedimentoStore}
    />
  );
};

export default IncontroFormContainer;
