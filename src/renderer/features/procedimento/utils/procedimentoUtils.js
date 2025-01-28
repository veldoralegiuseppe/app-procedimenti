import { getTransazioniPersone } from '@features/persona';
import { ModelTypes } from '@shared/metadata';
import { ModelFactory } from '@ui-shared/components';
import _ from 'lodash';

const getTransazioniProcedimento = ({ procedimento, persone, overrides }) => {
  const result = {};

  console.log('getTransazioniProcedimento', procedimento, persone, overrides);

  // Filter and map transazioni from procedimento
  let transazioniProcedimento = _.values(procedimento)
    .filter((value) => _.isEqual(value?.type, ModelTypes.TRANSAZIONE))
    .map((t) =>
      ModelFactory.create({
        type: ModelTypes.TRANSAZIONE,
        initialValues: t,
        version: t.version,
      })
    )

    console.log('transazioniProcedimento', transazioniProcedimento)

  // Apply overrides to transazioniProcedimento
  if (_.isArray(_.get(overrides, 'procedimento'))) {
    _.forEach(overrides.procedimento, (t) => {
      let index = _.findIndex(transazioniProcedimento, (t2) =>
        _.isEqual(t.key, t2.key)
      );
      if (index === -1) {
        transazioniProcedimento.push(t);
      } else {
        _.merge(transazioniProcedimento[index], t);
      }
    });
  }

  result.transazioniProcedimento = transazioniProcedimento;

  // Process transazioniPersone and incassi if persone is an array
  if (_.isArray(persone)) {
    const { transazioniPersone, incassi } = getTransazioniPersone(
      persone,
      _.get(overrides, 'persone', [])
    );

    result.transazioniPersone = transazioniPersone;
    result.incassi = incassi;
  }

  return result;
};

export { getTransazioniProcedimento };
