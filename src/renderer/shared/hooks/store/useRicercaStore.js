import { useModelStore } from '@ui-shared/hooks';

const useRicercaStore = (store) => {
  const modelStoreInterface = useModelStore(store);

  return { ...modelStoreInterface };
};

export default useRicercaStore;
