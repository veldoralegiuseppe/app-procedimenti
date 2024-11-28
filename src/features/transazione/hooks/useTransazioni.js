import { useModelArray } from '@shared/hooks';

/**
 * Interfaccia di un model array di transazioni.
 *
 * @param {Object} params - I parametri per l'hook.
 * @param {Function} params.set - Funzione per impostare lo stato.
 * @param {Function} params.get - Funzione per ottenere lo stato.
 * @param {Array} [params.initialPersone=[]] - Array iniziale di persone.
 * @param {Object} [params.options={}] - Opzioni aggiuntive per il model array.
 * @returns {Object} - Un oggetto contenente gli elementi iniziali e le proprietà del model array.
 */
export const useTransazioni = ({ set, get, initialPersone = [], options = {} }) => ({
  items: initialPersone,
  ...useModelArray(set, get, options),
});
