import * as React from 'react';
import {FormContainer} from '@shared/components';
import {useDynamicOptions} from '@shared/hooks';
import { SEZIONI } from '@features/procedimento';

const IstanzaFormContainer = ({ config = {}, procedimentoStore }) => {
    
  const {
    options: sediDeposito,
    addOption: addSedeDeposito,
    removeOption: removeSedeDeposito,
  } = useDynamicOptions([]);

  const {
    options: sediSvolgimento,
    addOption: addSedeSvolgimento,
    removeOption: removeSedeSvolgimento,
  } = useDynamicOptions([]);

  const configOverride = React.useMemo(() => {
    const overriddenRenderOverrides = {
      campi: {
        ...config?.renderOverrides?.campi,
        sedeDeposito: {
          ...config?.renderOverrides?.campi?.sedeDeposito,
          options: sediDeposito,
          onSubmit: addSedeDeposito,
          onDelete: removeSedeDeposito,
          validations: ['required'],
        },
        sedeSvolgimento: {
          ...config?.renderOverrides?.campi?.sedeSvolgimento,
          options: sediSvolgimento,
          onSubmit: addSedeSvolgimento,
          onDelete: removeSedeSvolgimento,
          validations: ['required'],
        },
      },
    };
  
    return {
      ...config,
      renderOverrides: overriddenRenderOverrides,
    };
  }, [config, sediDeposito, addSedeDeposito, removeSedeDeposito]);

  const memorizedSezioni = React.useMemo(() => [SEZIONI.ISTANZA_MEDIAZIONE], []);
  
  return (
    <FormContainer
      config={configOverride}
      sezioni={memorizedSezioni}
      store={procedimentoStore}
    />
  );
};

export default IstanzaFormContainer;
