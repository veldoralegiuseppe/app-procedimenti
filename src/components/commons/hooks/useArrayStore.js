import { useCallback } from 'react';

const useArrayStore = (arrayStore) => {
  const addItem = useCallback((newItem) => arrayStore.getState().addItem(newItem), [arrayStore]);
  const updateItem = useCallback((index, updates) => arrayStore.getState().updateItem(index, updates), [arrayStore]);
  const removeItem = useCallback((index) => arrayStore.getState().removeItem(index), [arrayStore]);
  const filterItems = useCallback((filter) => arrayStore.getState().filterItems(filter), [arrayStore]);
  const findItem = useCallback((filter) => arrayStore.getState().findItem(filter), [arrayStore]);
  const getItemProperty = useCallback((index, property) => arrayStore.getState().getItemProperty(index, property), [arrayStore]);

  return { addItem, updateItem, removeItem, filterItems, findItem, getItemProperty };
};

export { useArrayStore };
