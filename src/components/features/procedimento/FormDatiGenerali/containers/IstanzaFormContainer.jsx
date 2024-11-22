import * as React from 'react';
import FormContainer from '@components/commons/FormContainer/FormContainer';
import useDynamicOptions from '@components/commons/hooks/useDynamicOptions';
import { SEZIONI } from '@model/procedimento';

const IstanzaFormContainer = ({ config = {} }) => {
    
  const {
    options: sediDeposito,
    addOption: addSedeDeposito,
    removeOption: removeSedeDeposito,
  } = useDynamicOptions([]);

  const renderOverrides = {
    campi: {
      ...config?.renderOverrides?.campi,
      
      sedeDeposito: {
        ...config?.renderOverrides?.campi?.sedeDeposito,
        options: sediDeposito,
        onSubmit: addSedeDeposito,
        onDelete: removeSedeDeposito,
        validations: ['required'],
      },
    },
  };

  const configOverride = {
    ...config,
    renderOverrides
  };

  return (
    <FormContainer
      config={configOverride}
      sezioni={[SEZIONI.ISTANZA_MEDIAZIONE]}
    />
  );
};

export default IstanzaFormContainer;
