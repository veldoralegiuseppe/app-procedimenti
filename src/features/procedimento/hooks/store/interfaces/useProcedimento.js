import { useModel } from '@shared/hooks';
import { Pipeline } from '@utils';
import { inputValidator, updateValidator } from '@utils/filters';
import { ModelFactory } from '@shared/components';
import {FieldTypes } from '@shared/metadata';
import _, { initial } from 'lodash';

/**
 * Interfaccia funzionale dello store Procedimento.
 *
 * @param {Object} initialProcedimento - L'oggetto iniziale del procedimento.
 * @param {Object} [options={}] - Opzioni aggiuntive per la configurazione del modello.
 * @returns {Object} - L'oggetto contenente il modello e le funzioni del modello.
 */
const useProcedimento = ({
  set,
  get,
  subscribe,
  initialProcedimento,
  options = {},
}) => {
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
    initialModel: initialProcedimento,
  });

  return {
    // Interfaccia funzionale del model store
    ...modelInterface,

    // Metodi specifici
    getTransazioni: () => {
      const rootPath = options?.namespace ? `${options.namespace}.model` : 'model';
      const model = _.get(get(), rootPath)
          
      return _.filter(model, (value) => value?.type === FieldTypes.TRANSAZIONE);
    },
  };
};

export default useProcedimento;
