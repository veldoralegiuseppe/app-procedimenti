/**
 * Valida l'input fornito in base ai metadati specificati.
 *
 * @param {string} key - Il nome del campo da validare.
 * @param {string|Object} valore - Il valore del campo.
 * @param {Object} metadati - I metadati che contengono le regole di validazione per ciascun campo.
 * @returns {boolean | string} Ritorna true se tutti i campi sono validi o se non ci sono regole di validazione, altrimenti ritorna il primo messaggio di errore presente nell'array di messaggi di errore.
 */
const validateInput = (key, valore, metadati) => {
  const validator = metadati[key]?.validation;
  if (!validator || valore === undefined || valore === null) return true;

  const arrayErrori = validator(valore);
  return arrayErrori.length > 0 ? arrayErrori[0] : true;
};

/**
 * Rappresenta un filtro nel pattern Pipeline and Filter.
 * Valida l'input in base ai metadati e al contesto forniti.
 *
 * @namespace inputValidator
 * @property {function} process - Processa la validazione dell'input.
 * @param {Object} params - I parametri per la validazione.
 * @param {string} params.key - Il nome del campo da validare.
 * @param {string|Object} params.valueOrEvent - Il valore del campo o un evento che contiene il valore del campo.
 * @param {Object} params.metadati - I metadati utilizzati per la validazione.
 * @param {Object} params.context - Il contesto in cui viene eseguita la validazione.
 * @throws {Error} Lancia un errore se l'input non è valido.
 * @returns {Object} Ritorna un oggetto contenente la chiave, il valore, i metadati e il contesto se l'input è valido.
 */
export const inputValidator = {
  process: ({ key, value, model, context, ...rest }) => {
    const errorMessage = rest.errorMessage || {};
    
    if (errorMessage[key]) return { key, value, model, context, ...rest };

    const isValidOrErrorMessage = validateInput(key, value, model.constructor.getMetadati());
    if (isValidOrErrorMessage !== true) {
      errorMessage[key] = isValidOrErrorMessage;
      return { key, value, model, context, errorMessage, ...rest };
    }

    return { key, value, model, context, ...rest };
  },
};
