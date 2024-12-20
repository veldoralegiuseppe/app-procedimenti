import { useModel } from '@shared/hooks';
import { Pipeline } from '@utils';
import { inputValidator, updateValidator } from '@utils/filters';
import { FieldTypes } from '@shared/metadata';

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

    getTransazioni: () => {
      const rootPath = options?.namespace ? `${options.namespace}.model` : 'model';
      const model = _.get(get(), rootPath)
      console.log('model persona', model);
          
      return _.filter(model, (value) => value?.type === FieldTypes.TRANSAZIONE);
    },
  };
};

export default usePersona;
