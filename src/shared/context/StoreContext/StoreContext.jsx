import React, { createContext } from 'react';
import { useProcedimento } from '@features/procedimento';
import { usePersone, usePersona } from '@features/persona';
import { useCreateStore } from '@shared/hooks';
import {FieldTypes} from '@shared/metadata';

export const StoreContext = createContext();

const StoreProvider = ({ children }) => {
  const procedimentoStore = useCreateStore({storeInterface: useProcedimento});
  const personeStore = useCreateStore({storeInterface: usePersone});
  const personaFisicaStore = useCreateStore({storeInterface: usePersona});
  const personaGiuridicaStore = useCreateStore({storeInterface: usePersona});

  const storeMap = React.useMemo(() => ({
    [FieldTypes.PROCEDIMENTO]: procedimentoStore,
    [FieldTypes.PERSONE]: personeStore,
    [FieldTypes.PERSONA_FISICA]: personaFisicaStore,
    [FieldTypes.PERSONA_GIURIDICA]: personaGiuridicaStore,
  }), [procedimentoStore]);

  return (
    <StoreContext.Provider value={{ storeMap }}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreProvider;