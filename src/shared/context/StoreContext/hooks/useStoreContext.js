import { useContext } from 'react';
import { StoreContext } from '../StoreContext';

const useStoreContext = () => {
  const stores = useContext(StoreContext);
  if (!stores || Object.keys(stores).length === 0) {
    throw new Error('useStoreContext must be used within a StoreProvider');
  }
  return stores;
};

export default useStoreContext;
