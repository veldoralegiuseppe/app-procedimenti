import * as React from 'react';
import FormContainer from '@components/commons/FormContainer/FormContainer';
import useDynamicOptions from '@components/commons/hooks/useDynamicOptions';
import { SEZIONI } from '@model/Procedimento/procedimento';

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
