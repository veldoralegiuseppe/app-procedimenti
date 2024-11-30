import React, { createContext } from 'react';
import { useProcedimento } from '@features/procedimento';
import { useCreateStore } from '@shared/hooks';

export const StoreContext = createContext();

const StoreProvider = ({ children }) => {
  const procedimentoStore = useCreateStore({storeInterface: useProcedimento});

  return (
    <StoreContext.Provider value={{ procedimentoStore }}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreProvider;