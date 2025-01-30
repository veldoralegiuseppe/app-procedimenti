import { useEffect, useState, useRef } from 'react';
import { ModelTypes } from '@shared/metadata';
import { useStoreContext } from '@ui-shared/context';
import { StoreTypes } from '@ui-shared/metadata';
import _ from 'lodash';

const usePersonaSelect = (onChange, persone = [], ruolo, indexPersona) => {
  const store = useStoreContext(StoreTypes.RICERCA);

  const extractOption = (persona) => {
    if (!persona) return '';

    if (persona.type === ModelTypes.PERSONA_FISICA) {
      return {
        value: `${persona.nome} ${persona.cognome}`,
        type: persona.type,
        id: _.get(persona, 'id'),
      };
    }

    return { value: persona.denominazione, type: persona.type, id: persona.id };
  };

  const findPersonaById = (id) => _.isNumber(id) ? _.find(persone, (p) => p.id === id) : null;

  const lastIndexSelected = useRef(indexPersona || null);
  const [value, setValue] = useState(
    () => extractOption(findPersonaById(indexPersona))?.value || ''
  );

  useEffect(() => {
    lastIndexSelected.current = indexPersona;
    const nextValue = extractOption(findPersonaById(indexPersona))?.value || '';
    console.log('usePersonaSelect', { indexPersona, value, nextValue });
    if (!_.isEqual(value, nextValue)) {
      setValue(nextValue);
    }
  }, []);

  const filterFn = (persone) => {
    return persone.filter((p) =>
      !_.isUndefined(ruolo) ? _.isEqual(p.ruolo, ruolo) : true
    );
  };

  const groupBy = (anagrafica, option) => {
    const id = option?.id;
    const numProtocollo = store
      .getState()
      .getProcedimentoProperty({ key: 'numProtocollo' });
    const hasModifiche = store
      .getState()
      .hasModifiche({ numProtocollo, indexPersona: id });

    return option.type === ModelTypes.PERSONA_FISICA
      ? 'Persone fisiche' + (hasModifiche ? ' (modificati)' : '')
      : 'Persone giuridiche' + (hasModifiche ? ' (modificati)' : '');
  };

  const isOptionEqualToValue = (option, anagrafica) => {
    console.log('isOptionEqualToValue', {
      option,
      anagrafica,
      lastIndexSelected: lastIndexSelected.current,
    });
    return _.isEqual(option?.id, lastIndexSelected.current);
  };

  const handleBlur = (anagrafica, option) => {
    const newIndex = option?.id >= 0 ? option.id : null;

    lastIndexSelected.current = newIndex;
    const newPersonaSelezionata =  findPersonaById(newIndex)

    console.log('handleBlur', { anagrafica, option, newIndex, newPersonaSelezionata });

    setValue(extractOption(newPersonaSelezionata)?.value || '');
    onChange?.(newIndex);
  };

  return {
    value,
    isOptionEqualToValue,
    extractOption,
    groupBy,
    handleBlur,
    filterFn,
  };
};

export default usePersonaSelect;
