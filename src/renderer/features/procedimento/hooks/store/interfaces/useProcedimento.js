import { useModel } from '@ui-shared/hooks';
import { Pipeline } from '@utils';
import { inputValidator, updateValidator } from '@utils/filters';
import { ModelTypes } from '@shared/metadata';
import _ from 'lodash';

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
  initialModel,
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
    initialModel,
  });

  const getTransazioni = (overrides) => {
    const arrayTransazioni = modelInterface.findProperties({
      predicate: (value) => value?.type === ModelTypes.TRANSAZIONE,
    });
    const sortTransazioni = _.sortBy(arrayTransazioni, 'key');
    const sortOverrides = _.isArray(overrides)
      ? _.sortBy(overrides, 'key')
      : [];

      console.log('arrayTransazioni', arrayTransazioni, 'sortTransazioni', sortTransazioni, 'sortOverrides', sortOverrides);
    return _.merge(sortTransazioni, sortOverrides);
  };

  return {
    // Interfaccia funzionale del model store
    ...modelInterface,

    // Metodi specifici
    getTransazioni,
  };
};

export default useProcedimento;
