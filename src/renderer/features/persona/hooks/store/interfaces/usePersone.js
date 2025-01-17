import { useModelArray } from '@ui-shared/hooks';
import { ModelFactory } from '@ui-shared/components';
import { ModelTypes, PersonaEnumsV1, TransazioneEnumsV1 } from '@shared/metadata';

import _ from 'lodash';

/**
 * Interfaccia di un model array di persone.
 *
 * @param {Object} params - I parametri per l'hook.
 * @param {Function} params.set - Funzione per impostare lo stato.
 * @param {Function} params.get - Funzione per ottenere lo stato.
 * @param {Array} [params.initialPersone=[]] - Array iniziale di persone.
 * @param {Object} [params.options={}] - Opzioni aggiuntive per l'hook.
 * @returns {Object} - Un oggetto contenente l'array di persone e le proprietà dell'hook useModelArray.
 */
const usePersone = ({ set, get, initialItems = [], options = {} }) => {
  const modelArrayInterface = useModelArray({
    set,
    get,
    options,
    initialItems,
  });

  const getIncassi = () => {
    const key = options?.namespace ? `${options.namespace}.items` : 'items';
    const persone = _.get(get(), key, []);
    const tot = {
      importoDovutoParti: 0,
      importoCorrispostoParti: 0,
      importoDovutoControparti: 0,
      importoCorrispostoControparti: 0,
    };

    const getTransazioni = (persona) => {
      return Object.values(persona || {})
      .filter((field) => field?.type === ModelTypes.TRANSAZIONE)
    };

    const getIncassoPersona = (persona) => {
      const isParteIstante = persona?.ruolo === PersonaEnumsV1.ruolo.PARTE_ISTANTE;
      const transazioni = getTransazioni(persona);

      transazioni.forEach((t) => {
          if (isParteIstante) {
            tot.importoCorrispostoParti += t.importoCorrisposto;
            tot.importoDovutoParti += t.importoDovuto;
          } else {
            tot.importoCorrispostoControparti += t.importoCorrisposto;
            tot.importoDovutoControparti += t.importoDovuto;
          }
        });
    };
    
    const createTransazione = (initialValues, isParte = true) => {
      return ModelFactory.create({
        type: ModelTypes.TRANSAZIONE,
        initialValues: {
          ...initialValues,
          importoDovuto: isParte
            ? tot.importoDovutoParti
            : tot.importoDovutoControparti,
          importoCorrisposto: isParte
            ? tot.importoCorrispostoParti
            : tot.importoCorrispostoControparti,
        },
      });
    };

    persone.forEach((persona) => getIncassoPersona(persona));

    return [
      createTransazione({
        nome: 'Incasso parti',
        tipo: TransazioneEnumsV1.tipo.ENTRATA,
      }),
      createTransazione(
        {
          nome: 'Incasso controparti',
          tipo: TransazioneEnumsV1.tipo.ENTRATA,
        },
        false
      ),
    ];
  };

  return { ...modelArrayInterface, getIncassi };
};

export default usePersone;
