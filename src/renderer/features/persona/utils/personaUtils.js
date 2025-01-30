import { ModelFactory } from '@ui-shared/components';
import { ModelTypes, PersonaEnumsV1, TransazioneEnumsV1 } from '@shared/metadata';
import { extractTransazioni } from '@features/transazione';
import _ from 'lodash';

const getTransazioniPersona = (persona, override = []) => {
  const owner = persona.type;

  let transazioni = extractTransazioni(persona);
  transazioni.map(t => _.merge(t, { owner }));

  if (Array.isArray(override) && override.length) {
    override.forEach((t) => {
      let index = transazioni.findIndex((t2) => _.isEqual(t.key, t2.key));
      if (index === -1) transazioni.push(t);
      else transazioni[index] = { ...transazioni[index], ...t };
    });
  }

  console.log('getTransazioniPersona', persona, override, transazioni);

  return transazioni;
};

const getTransazioniPersone = (persone, override) => {
  const tot = {
    importoDovutoParti: 0,
    importoCorrispostoParti: 0,
    importoDovutoControparti: 0,
    importoCorrispostoControparti: 0,
  };

  const transazioni = [];

  const getIncassoPersona = (persona, index) => {
    const isParteIstante =
      persona?.ruolo === PersonaEnumsV1.ruolo.PARTE_ISTANTE;
    const transactions = getTransazioniPersona(persona, override?.[index]);
    _.set(transazioni, index, transactions);

    console.log('getIncassoPersona', persona, transactions, override);

    transactions.forEach((t) => {
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

  return {
    incassi: [
      createTransazione({
        nome: 'Incasso parti',
        key: 'incassoParti',
        tipo: TransazioneEnumsV1.tipo.ENTRATA,
      }),
      createTransazione(
        {
          nome: 'Incasso controparti',
          key: 'incassoControparti',
          tipo: TransazioneEnumsV1.tipo.ENTRATA,
        },
        false
      ),
    ],
    transazioniPersone: transazioni,
  };
};

const getPartiControparti = (persone = []) => {
  const { PARTE_ISTANTE, CONTROPARTE } = PersonaEnumsV1.ruolo;
  const parti = [];
  const controparti = [];

  persone.forEach((persona, index) => {
    if (persona.ruolo === PARTE_ISTANTE)
      parti.push({ ...persona, _personeIndex: index });
    else if (persona.ruolo === CONTROPARTE)
      controparti.push({ ...persona, _personeIndex: index });
    else throw new Error('Ruolo non riconosciuto', persona);
  });

  return { parti, controparti };
};

export { getTransazioniPersona, getTransazioniPersone, getPartiControparti };
