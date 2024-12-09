import { useContext } from 'react';
import { StoreContext } from '../StoreContext';

const useStoreContext = (storeType) => {
  const {storeMap} = useContext(StoreContext);
  
  if (!storeMap || Object.keys(storeMap).length === 0) {
    throw new Error('useStoreContext must be used within a StoreProvider');
  }

  if (storeType) {
    if (!storeMap[storeType]) {
      throw new Error(`storeType ${storeType} not found in StoreContext`);
    }
    return storeMap[storeType];
  }

  return storeMap;
};

export default useStoreContext;
