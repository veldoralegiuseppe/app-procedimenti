import _ from 'lodash';
import { ModelFactory } from '@ui-shared/components';
import { ModelTypes } from '@shared/metadata';


const getTransazioniPersona = (persona, override = []) => {
  const owner = persona.type;
  let transazioni = Object.values(persona || {})
    .filter((field) => field?.type === ModelTypes.TRANSAZIONE)
    .map((t) =>
      ModelFactory.create({
        type: ModelTypes.TRANSAZIONE,
        initialValues: { ...t, owner: t.owner || owner },
        version: t.version,
      })
    );

   if(Array.isArray(override) && override.length) {
    override.forEach(t => {
      let index = transazioni.findIndex(t2 => _.isEqual(t.key, t2.key));
      if(index === -1) transazioni.push(t);
      else transazioni[index] = {...transazioni[index], ...t};
    });
   }

    console.log('getTransazioniPersona', persona, override, transazioni);

    return transazioni;
};

export { getTransazioniPersona };
