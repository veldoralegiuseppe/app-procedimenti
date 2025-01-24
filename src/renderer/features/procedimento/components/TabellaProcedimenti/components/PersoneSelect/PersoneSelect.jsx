import React from 'react';
import { OptionsAutocomplete } from '@ui-shared/components';
import usePersonaSelect from './hooks/usePersonaSelect';
import _ from 'lodash';

function PersoneSelect({ onChange, indexPersona, persone = [], ruolo }) {
  const {
    value,
    isOptionEqualToValue,
    extractValue,
    groupBy,
    handleBlur,
    filterFn,
  } = usePersonaSelect(indexPersona, onChange, persone, ruolo);

  return (
    <OptionsAutocomplete
      label="Seleziona una persona"
      value={value}
      deletable={false}
      creatable={false}
      isOptionEqualToValue={isOptionEqualToValue}
      optionsStore={persone}
      extractValue={extractValue}
      groupBy={groupBy}
      filterFn={filterFn}
      onBlur={handleBlur}
    />
  );
}

export default PersoneSelect;
