import { useMemo, useCallback } from 'react';
import { Procedimento } from '@features/procedimento';
import _ from 'lodash';

const useFormDatiGenerali = () => {
  
  // Override comuni per i campi
  const commonSx = useMemo(() => ({ width: '29.2rem' }), []);
  const renderOverrides = useMemo(
    () => ({
      campi: {
        oggettoControversia: { sx: commonSx },
        esitoMediazione: { sx: commonSx },
        causaleDemandata: { sx: commonSx },
        modalitaSvolgimento: { sx: commonSx },
        sedeDeposito: { sx: commonSx },
        sedeSvolgimento: { sx: commonSx },
        nomeMediatore: { sx: commonSx },
        cognomeMediatore: { sx: commonSx },
      },
    }),
    [commonSx]
  );

  // Configurazione per i container
  const config = useMemo(
    () => ({
      renderOverrides,
      model: { class: Procedimento },
    }),
    [renderOverrides]
  );

  return {
    config
  };
};

export default useFormDatiGenerali;
