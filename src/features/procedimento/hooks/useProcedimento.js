import { useModel } from '@shared/hooks';
import { Pipeline } from '@utils';
import { inputValidator, updateValidator } from '@utils/filters';
import _ from 'lodash';

/**
 * Interfaccia funzionale dello store Procedimento.
 *
 * @param {Object} initialProcedimento - L'oggetto iniziale del procedimento.
 * @param {Object} [options={}] - Opzioni aggiuntive per la configurazione del modello.
 * @returns {Object} - L'oggetto contenente il modello e le funzioni del modello.
 */
export const useProcedimento = ({
  set,
  get,
  initialProcedimento,
  options = {},
}) => {
  const updateModelPipeline = new Pipeline([]);

  return {
    model: initialProcedimento,
  
    // Interfaccia funzionale del model store
    ...useModel(set, get, {
      ...options,
      onSetProperty: (key, value) => {
        const result = updateModelPipeline.process({ key, value });
        if (result?.error) {
          console.error(`Errore nella pipeline per ${key}:`, result.error);
        }
      },
    }),

    // Metodi specifici
    getClassName: () => {
      const path = options?.namespace ? `${options.namespace}.className` : 'className';
      return _.get(get(), path);
    },

    getTransazioni: () => {
      const path = options?.namespace ? `${options.namespace}.model` : 'model';
      return _.get(get(), path);
    },
  };
};
