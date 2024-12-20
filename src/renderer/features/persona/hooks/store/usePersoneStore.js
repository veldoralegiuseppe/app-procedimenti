import { useModelArrayStore } from '@ui-shared/hooks';

const usePersoneStore = (store) => {
  const modelArrayStoreInterface = useModelArrayStore(store);
  return { ...modelArrayStoreInterface };
};

export default usePersoneStore;
