import { useCallback } from 'react';
import { useModelStore } from '@ui-shared/hooks';

const useRicercaStore = (store) => {
  const modelStoreInterface = useModelStore(store);
  const getUpdate = useCallback((key, namespace) => store(state => state.getUpdate(key,namespace)), [store]);
  const setUpdate = useCallback((changes, key, namespace, merge, predicate) => store.getState().setUpdate(changes,key,namespace,merge,predicate), [store]);
  
  return { 
    ...modelStoreInterface,
    getUpdate,
    setUpdate,
  };
};

export default useRicercaStore;
