import { produce } from 'immer';
import _ from 'lodash';

export const useModelArray = (set, get) => ({
  // Aggiunge un elemento all'array
  addItem: (newItem) => {
    set(
      produce((state) => {
        if (!Array.isArray(state.items)) {
          state.items = []; // Inizializza l'array se non esiste
        }
        state.items.push(newItem);
      })
    );
  },

  // Aggiorna un elemento dell'array in una posizione specifica
  updateItem: (index, updates) => {
    set(
      produce((state) => {
        const item = _.get(state.items, index);
        if (item) {
          _.merge(state.items[index], updates); // Aggiorna solo le proprietà specificate
        }
      })
    );
  },

  // Rimuove un elemento dall'array in una posizione specifica
  removeItem: (index) => {
    set(
      produce((state) => {
        if (Array.isArray(state.items)) {
          _.pullAt(state.items, index); // Usa lodash per rimuovere l'elemento
        }
      })
    );
  },

  // Filtra gli elementi dell'array usando una funzione
  filterItems: (filterFn) => {
    const items = _.get(get(), 'model.items', []);
    return _.filter(items, filterFn);
  },

  // Trova un elemento dell'array usando una funzione
  findItem: (filterFn) => {
    const items = _.get(get(), 'model.items', []);
    return _.find(items, filterFn);
  },

  // Ottiene un elemento specifico dell'array
  getItem: (index) => {
    return _.get(get(), ['model.items', index]);
  },

  // Ottiene una proprietà specifica di un elemento dell'array
  getItemProperty: (index, property) => {
    return _.get(get(), ['model.items', index, property]);
  }
});
