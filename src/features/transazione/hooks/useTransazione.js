import { useModel } from '@shared/hooks';
import { Pipeline } from '@utils';
import { inputValidator, updateValidator } from '@utils/filters';

/**
 * Interfaccia funzionale dello store Transazione.
 *
 * @param {Object} initialTransazione - L'oggetto iniziale del procedimento.
 * @param {Object} [options={}] - Opzioni aggiuntive per la configurazione del modello.
 * @returns {Object} - L'oggetto contenente il modello e le funzioni del modello.
 */
const useProcedimento = ({ set, get, initialTransazione, options = {} }) => {
  const updateModelPipeline = new Pipeline([]);

  return {
    model: initialTransazione,

    ...useModel(set, get, {
      ...options,
      onSetProperty: (key, value) => {
        const result = updateModelPipeline.process({ key, value });
        if (result?.error) {
          console.error(`Errore nella pipeline per ${key}:`, result.error);
        }
      },
    }),
  };
};

export default useProcedimento;
