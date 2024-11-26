import { useStore } from 'zustand';
import { useCallback } from 'react';

export const useArrayWriter = (store) => {

  const updateField = useStore(store, (state) => state.updateItem);

  return useCallback(
    (index, update) => {
      updateField(index, update);
    },
    [updateField] 
  );
};
