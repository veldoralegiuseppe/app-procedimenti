import React, { createContext } from 'react';
import { useProcedimento } from '@features/procedimento';
import { useCreateStore } from '@shared/hooks';
import {FieldTypes} from '@shared/metadata';

export const StoreContext = createContext();

const StoreProvider = ({ children }) => {
  const procedimentoStore = useCreateStore({storeInterface: useProcedimento});

  const storeMap = React.useMemo(() => ({
    [FieldTypes.PROCEDIMENTO]: procedimentoStore,
  }), [procedimentoStore]);

  return (
    <StoreContext.Provider value={{ storeMap }}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreProvider;