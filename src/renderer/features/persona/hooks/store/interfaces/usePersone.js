import { useModelArray } from '@ui-shared/hooks';

/**
 * Interfaccia di un model array di persone.
 *
 * @param {Object} params - I parametri per l'hook.
 * @param {Function} params.set - Funzione per impostare lo stato.
 * @param {Function} params.get - Funzione per ottenere lo stato.
 * @param {Array} [params.initialPersone=[]] - Array iniziale di persone.
 * @param {Object} [params.options={}] - Opzioni aggiuntive per l'hook.
 * @returns {Object} - Un oggetto contenente l'array di persone e le proprietà dell'hook useModelArray.
 */
const usePersone = ({ set, get, initialItems = [], options = {} }) => ({
  ...useModelArray({set, get, options, initialItems}),
});

export default usePersone;
