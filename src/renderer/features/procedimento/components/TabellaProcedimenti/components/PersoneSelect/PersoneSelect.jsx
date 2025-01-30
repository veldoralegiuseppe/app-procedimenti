import React from 'react';
import { OptionsAutocomplete } from '@ui-shared/components';
import usePersonaSelect from './hooks/usePersonaSelect';
import _ from 'lodash';

function PersoneSelect({ indexPersona, onChange, persone = [], ruolo }) {
  const {
    value,
    isOptionEqualToValue,
    extractOption,
    groupBy,
    handleBlur,
    filterFn,
  } = usePersonaSelect(onChange, persone, ruolo, indexPersona);

  
  console.log('PersonaSelect', {persone, value, ruolo, indexPersona, personeOrdinate: _.sortBy(persone, (persona) => groupBy('', persona))});

  return (
    <OptionsAutocomplete
      label="Seleziona una persona"
      value={value}
      deletable={false}
      creatable={false}
      isOptionEqualToValue={isOptionEqualToValue}
      optionsStore={persone}
      extractOption={extractOption}
      groupBy={groupBy}
      filterFn={filterFn}
      onBlur={handleBlur}
    />
  );
}

export default PersoneSelect;
