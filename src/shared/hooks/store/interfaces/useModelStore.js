import { useCallback } from 'react';

/**
 * Hook per l'utilizzo di un model store.
 * 
 * @param {Object} store - L'oggetto store da utilizzare.
 * @returns {Object} - Un oggetto contenente le funzioni per interagire con lo store.
 * @returns {undefined} touchedFields - Campi toccati (attualmente non implementato).
 * @returns {Function} setProperty - Funzione per impostare una proprietà nello store.
 * @returns {Function} resetModel - Funzione per resettare il modello nello store.
 * @returns {undefined} setTouchedFields - Funzione per impostare i campi toccati (attualmente non implementato).
 * @returns {Function} getProperty - Funzione per ottenere una proprietà dallo store.
 */
const useModelStore = (store) => {
  const setProperty = useCallback((key, value, validations) => store.getState().setProperty(key, value, validations), [store]);
  const resetModel = useCallback((newModel) => store.getState().resetModel(newModel), [store]);
  const getModel = useCallback(() => store.getState().getModel(), [store]);
  const getProperty = useCallback((key) => store(state => state.getProperty(key)), [store]);
  const getProperties = useCallback((keys) => store.getState().getProperties(keys), [store]);
  const getPropertyAndDependencies = useCallback((key, dependencies) => store.getState().getPropertyAndDependencies(key, dependencies), [store]);
  const getFieldErrors = useCallback((key) => store(state => state.getFieldErrors(key)), [store]);

  return { 
    touchedFields: undefined, 
    getModel, 
    setProperty, 
    resetModel, 
    setTouchedFields: undefined, 
    getProperty, getProperties, 
    getPropertyAndDependencies,
    getFieldErrors,
  };
};

export default useModelStore;
