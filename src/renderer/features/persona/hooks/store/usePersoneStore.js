import { useCallback } from 'react';
import { useModelArrayStore } from '@ui-shared/hooks';

const usePersoneStore = (store) => {
  const modelArrayStoreInterface = useModelArrayStore(store);
  const getIncassi = useCallback((override) => store.getState().getIncassi(override), [store]);
  const getTransazioniPersona = useCallback((index, override) => store.getState().getTransazioniPersona(index, override), [store]);
  const getPartiControparti = useCallback(() => store.getState().getPartiControparti(), [store]);

  return { ...modelArrayStoreInterface, getIncassi, getTransazioniPersona, getPartiControparti };
};

export default usePersoneStore;
