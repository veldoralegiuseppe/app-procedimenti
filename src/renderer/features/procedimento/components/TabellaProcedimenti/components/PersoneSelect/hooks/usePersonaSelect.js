import { useEffect, useRef, useState } from 'react';
import { ModelTypes } from '@shared/metadata';
import { FieldTypes } from '@ui-shared/metadata';
import { useStoreContext } from '@ui-shared/context';
import { usePersonaStore, usePersoneStore } from '@features/persona';
import _ from 'lodash';

const usePersonaSelect = (indexPersona, onChange) => {
  const personeStore = useStoreContext(FieldTypes.PERSONE);
  const personaFisicaStore = useStoreContext(ModelTypes.PERSONA_FISICA);
  const personaGiuridicaStore = useStoreContext(ModelTypes.PERSONA_GIURIDICA);

  const { getItem } = usePersoneStore(personeStore);
  const { resetModel: resetPersonaFisica } =
    usePersonaStore(personaFisicaStore);
  const { resetModel: resetPersonaGiuridica } = usePersonaStore(
    personaGiuridicaStore
  );

  const [lastIndexSelected, setLastIndexSelected] = useState(null);
  const lastValueSelected = useRef('');

  const extractValue = (persona) => {
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
    const persona = option ? getItem(option.id) : null;
    const newIndex = option?.id >= 0 ? option.id : null;

    setLastIndexSelected(newIndex);
    lastValueSelected.current = anagrafica || '';

    if (option?.type === ModelTypes.PERSONA_FISICA) resetPersonaFisica(persona);
    else if (option?.type === ModelTypes.PERSONA_GIURIDICA)
      resetPersonaGiuridica(persona);
    else {
      resetPersonaFisica();
      resetPersonaGiuridica();
    }

    onChange?.(newIndex);
  };

  useEffect(() => {
    if (indexPersona != null && !_.isEqual(indexPersona, lastIndexSelected)) {
      setLastIndexSelected(() => {
        const persona = getItem(indexPersona);
        lastValueSelected.current = persona
          ? extractValue(persona)?.value || ''
          : '';
        return indexPersona;
      });
    }
  }, [indexPersona]);

  return {
    personeStore,
    lastValueSelected,
    isOptionEqualToValue,
    extractValue,
    groupBy,
    handleBlur,
  };
};

export default usePersonaSelect;
