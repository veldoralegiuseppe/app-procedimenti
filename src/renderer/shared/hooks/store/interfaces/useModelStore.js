import { useCallback } from 'react';

/**
 * Hook per l'utilizzo di un model store.
 * 
 * @param {Object} store - L'oggetto store da utilizzare.
 * @returns {Object} - Un oggetto contenente le funzioni per interagire con lo store.
 * @returns {Function} setProperty - Funzione per impostare una proprietà nello store.
 * @returns {Function} resetModel - Funzione per resettare il modello nello store.
 * @returns {Function} getProperty - Funzione per ottenere una proprietà dallo store.
 */
const useModelStore = (store) => {
  const setProperty = useCallback((props) => store?.getState()?.setProperty(props), [store]);
  const removeProperty = useCallback((props) => store?.getState()?.removeProperty(props), [store]);
  const resetModel = useCallback((newModel) => store?.getState()?.resetModel(newModel), [store]);
  const getProperty = useCallback((props) => store(state => state.getProperty(props)), [store]);
  const getProperties = useCallback((props) => store?.getState()?.getProperties(props), [store]);
  const findProperties = useCallback((props) => store?.getState()?.findProperties(props), [store]);
  const getModel = useCallback(() => store?.getState()?.getModel(), [store]);
  const getPropertyAndDependencies = useCallback((props) => store?.getState()?.getPropertyAndDependencies(props), [store]);
  const setErrors = useCallback((props) => store?.getState()?.setErrors(props), [store]);
  const getFieldErrors = useCallback((props) => store(state => state.getFieldErrors(props)), [store]);

  return { 
    getModel, 
    setProperty, 
    resetModel, 
    getProperty, getProperties, 
    getPropertyAndDependencies,
    getFieldErrors,
    removeProperty,
    setErrors,
    findProperties
  };
};

export default useModelStore;
