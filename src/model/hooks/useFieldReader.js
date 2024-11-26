import { useStore } from 'zustand';
import _ from 'lodash';

/**
 * Legge un valore specifico dallo store Zustand utilizzando il metodo getProperty.
 * 
 * @param {Function} store - La funzione dello store Zustand.
 * @param {string} fieldKey - La chiave del campo da leggere.
 * @returns {*} - Il valore specificato dal campo.
 */
export const useFieldReader = (store, fieldKey) => {
 
  if (typeof store !== 'function') {
    throw new Error(
      `Invalid store passed to useFieldReader. Expected a Zustand hook function but received: ${typeof store}`
    );
  }

  const getProperty = useStore(store, (state) => state.getProperty);

  return useStore(
    store,
    (state) => getProperty ? getProperty(fieldKey) : _.get(state, fieldKey),
    _.isEqual // Confronto profondo per evitare re-render non necessari
  );
};
