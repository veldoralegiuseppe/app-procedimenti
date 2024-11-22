import { useMemo, useContext } from 'react';
import { ProcedimentoContext } from '@context/Procedimento';
import _ from 'lodash';

// Funzione per il confronto di valori
const isEqualWithCustomLogic = (fieldValue, modelValue) => {
  if (fieldValue?.equals && typeof fieldValue.equals === 'function') {
    return fieldValue.equals(modelValue);
  }

  return _.isEqual(fieldValue, modelValue);
};

// Hook per calcolare se il modello è stato modificato
export const useModelChanged = (touchedFields, model) => {
  const { initialModels } = useContext(ProcedimentoContext);
  const initialModel = initialModels[model.constructor.name];

  const isModified = useMemo(() => {
    return Object.entries(touchedFields).some(([key, value]) => {
      const originalValue = initialModel[key];
      return !isEqualWithCustomLogic(originalValue, value);
    });
  }, [touchedFields, model]);

  return isModified;
};
