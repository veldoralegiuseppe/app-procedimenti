import { useModel } from '@ui-shared/hooks';
import { Pipeline } from '@utils';
import { inputValidator, updateValidator } from '@utils/filters';
import { getTransazioniPersona } from '@features/persona';
import _ from 'lodash';

/**
 * Interfaccia funzionale dello store Persona.
 *
 * @param {Object} initialPersona - L'oggetto iniziale del procedimento.
 * @param {Object} [options={}] - Opzioni aggiuntive per la configurazione del modello.
 * @returns {Object} - L'oggetto contenente il modello e le funzioni del modello.
 */
const usePersona = ({ set, get, subscribe, initialModel, options = {} }) => {
  const updateModelPipeline = new Pipeline([]);

  const modelInterface = useModel({
    set,
    get,
    subscribe,
    options: {
      ...options,
      onSetProperty: (key, value) => {
        const result = updateModelPipeline.process({ key, value });
        if (result?.error) {
          console.error(`Errore nella pipeline per ${key}:`, result.error);
        }
        options?.onSetProperty?.(key, value);
      },
    },
    initialModel,
  });

  return {
  
   ...modelInterface,

    getTransazioni: (override = []) => {
      const rootPath = options?.namespace ? `${options.namespace}.model` : 'model';
      const model = _.get(get(), rootPath)
      const transazioni = getTransazioniPersona(model, override);
          
      return transazioni;
    },
  };
};

export default usePersona;
