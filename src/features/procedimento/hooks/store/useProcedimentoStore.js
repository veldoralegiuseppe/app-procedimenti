import { useCallback } from 'react';
import { useModelStore } from '@shared/hooks';

const useProcedimentoStore = (store) => {
  const modelStoreInterface = useModelStore(store);
  const getTransazioni = useCallback(() => store.getState().getTransazioni(),[store]);

  return { ...modelStoreInterface, getTransazioni };
};

export default useProcedimentoStore;
