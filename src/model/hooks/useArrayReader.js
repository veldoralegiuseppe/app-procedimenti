import { useStore } from 'zustand';
import _ from 'lodash';

/**
 * Legge un elemento specifico di un array o una sua proprietà specifica da uno store Zustand,
 * utilizzando il metodo getItem se disponibile.
 *
 * @param {Object} params - Parametri della funzione.
 * @param {Function} params.store - La funzione dello store Zustand.
 * @param {number} params.index - L'indice dell'elemento nell'array.
 * @param {string} [params.property] - (Opzionale) La proprietà specifica dell'elemento dell'array.
 * @returns {*} - L'elemento specificato o la sua proprietà.
 */
export const useArrayReader = (store, index, property) => {
  // Verifica che lo store sia una funzione valida
  if (typeof store !== 'function') {
    throw new Error(
      `Invalid store passed to useArrayReader. Expected a Zustand hook function but received: ${typeof store}`
    );
  }

  // Ottieni la funzione getItem dallo store
  const getItem = useStore(store, (state) => state.getItem);

  return useStore(
    store,
    () => {
      // Usa getItem se definito
      if (typeof getItem === 'function') {
        const element = getItem(index);
        return property ? _.get(element, property, undefined) : element;
      }

      // Fallback: utilizza _.get direttamente
      const array = _.get(store.getState(), 'arrayKey'); // Specificare `arrayKey` se necessario
      if (Array.isArray(array)) {
        const element = array[index];
        return property ? _.get(element, property, undefined) : element;
      }

      return undefined;
    },
    _.isEqual // Confronto profondo per ottimizzazione dei re-render
  );
};
