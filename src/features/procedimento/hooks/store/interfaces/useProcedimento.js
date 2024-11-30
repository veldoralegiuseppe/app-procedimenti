import { useModel } from '@shared/hooks';
import { Pipeline } from '@utils';
import { inputValidator, updateValidator } from '@utils/filters';
import { ModelFactory } from '@shared/factories';
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
  initialProcedimento,
  options = {},
}) => {
  const updateModelPipeline = new Pipeline([]);

  const modelInterface = useModel({
    set,
    get,
    options: {
      ...options,
      onSetProperty: (key, value) => {
        const result = updateModelPipeline.process({ key, value });
        if (result?.error) {
          console.error(`Errore nella pipeline per ${key}:`, result.error);
        }
      },
    },
    initialModel: initialProcedimento,
  });

  return {

    // Interfaccia funzionale del model store
    ...modelInterface,

    // Metodi specifici
    getTransazioni: () => {
      const transazioniKeys = Object.values(
        ModelFactory.getMetadata('procedimento').metadata
      )
        .filter((m) => m.type === 'transazione')
        .map((m) => m.key);

      return modelInterface.getProperties(transazioniKeys);
    },
  };
};

export default useProcedimento;
