import React, { createContext } from 'react';
import { useProcedimento } from '@features/procedimento';
import { usePersone, usePersona } from '@features/persona';
import { useCreateStore } from '@shared/hooks';
import {FieldTypes} from '@shared/metadata';
import {ModelFactory} from '@shared/components';

export const StoreContext = createContext();

const StoreProvider = ({ children }) => {
  
  const procedimentoStore = useCreateStore({storeInterface: useProcedimento, initialModel: ModelFactory.create({type: FieldTypes.PROCEDIMENTO})});
  const personeStore = useCreateStore({storeInterface: usePersone});
  const personaFisicaStore = useCreateStore({storeInterface: usePersona, initialModel: ModelFactory.create({type: FieldTypes.PERSONA_FISICA})});
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