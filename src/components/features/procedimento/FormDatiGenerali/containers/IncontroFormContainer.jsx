import * as React from 'react';
import FormContainer from '@components/commons/FormContainer/FormContainer';
import useDynamicOptions from '@components/commons/hooks/useDynamicOptions';
import { SEZIONI } from '@model/procedimento';

const IncontroFormContainer = ({ config = {} }) => {
    
  const {
    options: sediSvolgimento,
    addOption: addSedeSvolgimento,
    removeOption: removeSedeSvolgimento,
  } = useDynamicOptions([]);

  const renderOverrides = {
    campi: {
      ...config?.renderOverrides?.campi,
      sedeSvolgimento: {
        ...config?.renderOverrides?.campi?.sedeSvolgimento,
        options: sediSvolgimento,
        onSubmit: addSedeSvolgimento,
        onDelete: removeSedeSvolgimento,
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
      sezioni={[SEZIONI.FISSAZIONE_INCONTRO]}
    />
  );
};

export default IncontroFormContainer;
