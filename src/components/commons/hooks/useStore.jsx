import { useMemo } from "react";

const useStore = (store) => {
  const touchedFields = store((state) => state.touchedFields);
  const setProperty = useMemo(
    () => store.getState().setProperty,
    [store]
  );
  const resetModel = useMemo(() => store.getState().resetModel, [store]);
  const setTouchedFields = useMemo(
    () => store.getState().setTouchedFields,
    [store]
  );

  return { touchedFields, setProperty, resetModel, setTouchedFields };
};

export  {useStore};