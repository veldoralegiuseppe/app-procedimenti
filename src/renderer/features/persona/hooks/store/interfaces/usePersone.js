import { useModelArray } from '@ui-shared/hooks';
import { ModelFactory } from '@ui-shared/components';
import { ModelTypes, PersonaEnumsV1, TransazioneEnumsV1 } from '@shared/metadata';
import { getTransazioniPersona as getTransazioni } from '@features/persona';

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

  const getIncassi = (override) => {
    const key = options?.namespace ? `${options.namespace}.items` : 'items';
    const persone = _.get(get(), key, []);
    const tot = {
      importoDovutoParti: 0,
      importoCorrispostoParti: 0,
      importoDovutoControparti: 0,
      importoCorrispostoControparti: 0,
    };

    const getIncassoPersona = (persona, index) => {
      const isParteIstante = persona?.ruolo === PersonaEnumsV1.ruolo.PARTE_ISTANTE;
      const transazioni = getTransazioni(persona, override?.[index]);
      console.log('getIncassoPersona', persona, transazioni, override);

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

    persone.forEach((persona, index) => getIncassoPersona(persona, index));

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

  const getTransazioniPersona = (index, override = []) => {
    const key = options?.namespace ? `${options.namespace}.items` : 'items';
    const persona = _.get(get(), `${key}[${index}]`, {});

    return getTransazioni(persona, override);
  }

  return { ...modelArrayInterface, getIncassi, getTransazioniPersona };
};

export default usePersone;
