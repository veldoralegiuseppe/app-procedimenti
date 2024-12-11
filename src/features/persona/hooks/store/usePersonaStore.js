import { useModelStore } from '@shared/hooks';

const usePersonaStore = () => {
  const modelStoreInterface = useModelStore(store);
  return { ...modelStoreInterface };
};

export default usePersonaStore;
