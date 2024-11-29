import { produce } from 'immer';
import _ from 'lodash';

/**
 * Interfaccia funzionale di un model array store.
 * Utilizza immer per la gestione immutabile dello stato e lodash per operazioni sugli array.
 *
 * @param {Function} set - Funzione per aggiornare lo stato.
 * @param {Function} get - Funzione per ottenere lo stato corrente.
 * @returns {Object} Metodi per la gestione dell'array di modelli.
 *
 * @method addItem
 * @description Aggiunge un nuovo elemento all'array.
 * @param {Object} newItem - Il nuovo elemento da aggiungere.
 *
 * @method updateItem
 * @description Aggiorna un elemento dell'array in una posizione specifica.
 * @param {number} index - L'indice dell'elemento da aggiornare.
 * @param {Object} updates - Le proprietà da aggiornare nell'elemento.
 *
 * @method removeItem
 * @description Rimuove un elemento dall'array in una posizione specifica.
 * @param {number} index - L'indice dell'elemento da rimuovere.
 *
 * @method filterItems
 * @description Filtra gli elementi dell'array usando una funzione.
 * @param {Function} filterFn - La funzione di filtro.
 * @returns {Array} Gli elementi filtrati.
 *
 * @method findItem
 * @description Trova un elemento dell'array usando una funzione.
 * @param {Function} filterFn - La funzione di ricerca.
 * @returns {Object|undefined} L'elemento trovato o undefined se non trovato.
 *
 * @method getItem
 * @description Ottiene un elemento specifico dell'array.
 * @param {number} index - L'indice dell'elemento da ottenere.
 * @returns {Object|undefined} L'elemento trovato o undefined se non trovato.
 *
 * @method getItemProperty
 * @description Ottiene una proprietà specifica di un elemento dell'array.
 * @param {number} index - L'indice dell'elemento.
 * @param {string} property - La proprietà da ottenere.
 * @returns {any} Il valore della proprietà specificata.
 */
const useModelArray = ({set, get, initialItems=[], options = {}}) => {
  const getNamespace = (key) => {
    return options?.namespace ? `${options.namespace}.${key}` : key;
  };

  return {
    items: initialItems,

    // Aggiunge un elemento all'array
    addItem: (newItem) => {
      set(
        produce((state) => {
          const key = getNamespace('items');
          if (!Array.isArray(_.get(state, key))) {
            _.set(state, key, []); // Inizializza l'array se non esiste
          }
          _.get(state, key).push(newItem);
        })
      );

      if (options?.onAddItem) {
        options.onAddItem(newItem);
      }
    },

    // Aggiorna un elemento dell'array in una posizione specifica
    updateItem: (index, updates) => {
      set(
        produce((state) => {
          const key = getNamespace(`items[${index}]`);
          const item = _.get(state, key);
          if (item) {
            _.merge(item, updates); // Aggiorna solo le proprietà specificate
          }
        })
      );

      if (options?.onUpdateItem) {
        options.onUpdateItem(index, updates);
      }
    },

    // Rimuove un elemento dall'array in una posizione specifica
    removeItem: (index) => {
      set(
        produce((state) => {
          const key = getNamespace('items');
          if (Array.isArray(_.get(state, key))) {
            _.pullAt(_.get(state, key), index); // Usa lodash per rimuovere l'elemento
          }
        })
      );

      if (options?.onRemoveItem) {
        options.onRemoveItem(index);
      }
    },

    // Filtra gli elementi dell'array usando una funzione
    filterItems: (filterFn) => {
      const key = getNamespace('items');
      const items = _.get(get(), key, []);
      const result = _.filter(items, filterFn);

      if (options?.onFilterItems) {
        options.onFilterItems(filterFn);
      }

      return result;
    },

    // Trova un elemento dell'array usando una funzione
    findItem: (filterFn) => {
      const key = getNamespace('items');
      const items = _.get(get(), key, []);
      const result = _.find(items, filterFn);

      if (options?.onFindItem) {
        options.onFindItem(filterFn);
      }

      return result;
    },

    // Ottiene un elemento specifico dell'array
    getItem: (index) => {
      const key = getNamespace(`items[${index}]`);
      const result = _.get(get(), key);

      if (options?.onGetItem) {
        options.onGetItem(index);
      }

      return result;
    },

    // Ottiene una proprietà specifica di un elemento dell'array
    getItemProperty: (index, property) => {
      const key = getNamespace(`items[${index}].${property}`);
      const result = _.get(get(), key);

      if (options?.onGetItemProperty) {
        options.onGetItemProperty(index, property);
      }

      return result;
    },
  };
};

export default useModelArray;
