import { useModelStore } from '@shared/hooks';

const usePersonaStore = (store) => {
  const modelStoreInterface = useModelStore(store);
  return { ...modelStoreInterface };
};

export default usePersonaStore;
