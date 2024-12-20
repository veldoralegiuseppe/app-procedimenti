import React from 'react';
import { useModelStore } from '@ui-shared/hooks';

const usePersonaStore = (store) => {
  const modelStoreInterface = useModelStore(store);
  const getTransazioni = React.useCallback(() => store.getState().getTransazioni(), [store]);
  return { ...modelStoreInterface, getTransazioni };
};

export default usePersonaStore;
