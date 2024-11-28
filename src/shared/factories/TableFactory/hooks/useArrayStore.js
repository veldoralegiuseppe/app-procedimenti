import { useCallback } from 'react';

/**
 * Hook per l'utilizzo di un array model store.
 * 
 * @param {Object} arrayStore - L'array store da utilizzare.
 * @returns {Object} - Un oggetto contenente le funzioni per manipolare l'array store.
 * @returns {Function} addItem - Aggiunge un nuovo elemento all'array store.
 * @returns {Function} updateItem - Aggiorna un elemento esistente nell'array store.
 * @returns {Function} removeItem - Rimuove un elemento dall'array store.
 * @returns {Function} filterItems - Filtra gli elementi dell'array store in base a un criterio.
 * @returns {Function} findItem - Trova un elemento nell'array store in base a un criterio.
 * @returns {Function} getItemProperty - Ottiene una proprietà di un elemento specifico dell'array store.
 * @returns {Function} getItem - Ottiene un elemento specifico dell'array store.
 */
const useArrayStore = (arrayStore) => {
  const addItem = useCallback((newItem) => arrayStore.getState().addItem(newItem), [arrayStore]);
  const updateItem = useCallback((index, updates) => arrayStore.getState().updateItem(index, updates), [arrayStore]);
  const removeItem = useCallback((index) => arrayStore.getState().removeItem(index), [arrayStore]);
  const filterItems = useCallback((filter) => arrayStore.getState().filterItems(filter), [arrayStore]);
  const findItem = useCallback((filter) => arrayStore.getState().findItem(filter), [arrayStore]);
  const getItemProperty = useCallback((index, property) => arrayStore.getState().getItemProperty(index, property), [arrayStore]);
  const getItem = useCallback((index) => arrayStore.getState().getItem(index), [arrayStore]);
  

  return { addItem, updateItem, removeItem, filterItems, findItem, getItemProperty, getItem };
};

export { useArrayStore };
