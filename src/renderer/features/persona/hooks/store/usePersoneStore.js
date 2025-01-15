import { useCallback } from 'react';
import { useModelArrayStore } from '@ui-shared/hooks';

const usePersoneStore = (store) => {
  const modelArrayStoreInterface = useModelArrayStore(store);
  const getIncassi = useCallback(() => store.getState().getIncassi(), [store]);
  return { ...modelArrayStoreInterface, getIncassi };
};

export default usePersoneStore;
