import { useStore } from 'zustand';
import { useCallback } from 'react';

export const useFieldWriter = (store) => {

  const updateField = useStore(store, (state) => state.setProperty);

  return useCallback(
    (fieldKey, value) => {
      updateField(fieldKey, value);
    },
    [updateField] 
  );
};
