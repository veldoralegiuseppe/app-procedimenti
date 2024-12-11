import { useModel } from '@shared/hooks';
import { Pipeline } from '@utils';
import { inputValidator, updateValidator } from '@utils/filters';

/**
 * Interfaccia funzionale dello store Persona.
 *
 * @param {Object} initialPersona - L'oggetto iniziale del procedimento.
 * @param {Object} [options={}] - Opzioni aggiuntive per la configurazione del modello.
 * @returns {Object} - L'oggetto contenente il modello e le funzioni del modello.
 */
const usePersona = ({ set, get, initialPersona, options = {} }) => {
  const updateModelPipeline = new Pipeline([]);

  return {
    ...useModel({
      set,
      get,
      initialModel: initialPersona,
      options: {
        ...options,
        onSetProperty: (key, value) => {
          const result = updateModelPipeline.process({ key, value });
          if (result?.error) {
            console.error(`Errore nella pipeline per ${key}:`, result.error);
          }
        },
      },
    }),
  };
};

export default usePersona;
