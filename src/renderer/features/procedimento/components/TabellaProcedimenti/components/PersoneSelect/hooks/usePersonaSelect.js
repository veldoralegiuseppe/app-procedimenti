import { useEffect, useState } from 'react';
import { ModelTypes } from '@shared/metadata';
import _ from 'lodash';

const usePersonaSelect = (indexPersona, onChange, persone=[], ruolo) => {
 
  const [lastIndexSelected, setLastIndexSelected] = useState(indexPersona || null);
  const [value, setValue] = useState(() => extractValue(persone[indexPersona]));

  useEffect(() => {
    setValue(extractValue(persone[indexPersona]));
  }, [indexPersona, persone]);
  
  const filterFn = (persone) => {
    return persone
      .map((p, id) => ({ ...p, id }))
      .filter((p) => !_.isUndefined(ruolo) ? _.isEqual(p.ruolo, ruolo) : true);
  }

  const extractValue = (persona) => {
    if (!persona) return '';

    if (persona.type === ModelTypes.PERSONA_FISICA) {
      return {
        value: `${persona.nome} ${persona.cognome}`,
        type: persona.type,
      };
    }

    return { value: persona.denominazione, type: persona.type };
  };

  const groupBy = (anagrafica, option) =>
    option.type === ModelTypes.PERSONA_FISICA
      ? 'Persone fisiche'
      : 'Persone giuridiche';

  const isOptionEqualToValue = (option, anagrafica) =>
    _.isEqual(option?.id, lastIndexSelected);

  const handleBlur = (anagrafica, option) => {
    const newIndex = option?.id >= 0 ? option.id : null;

    setLastIndexSelected(newIndex);
    setValue(extractValue(persone[newIndex]));
    onChange?.(newIndex);
  };

  return {
    value,
    isOptionEqualToValue,
    extractValue,
    groupBy,
    handleBlur,
    filterFn,
  };
};

export default usePersonaSelect;
