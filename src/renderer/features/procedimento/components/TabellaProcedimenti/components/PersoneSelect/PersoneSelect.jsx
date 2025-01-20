import React from 'react';
import { OptionsAutocomplete } from '@ui-shared/components';
import usePersonaSelect from './hooks/usePersonaSelect';
import _ from 'lodash';

function PersoneSelect({ onChange, indexPersona }) {
  const {
    personeStore,
    lastValueSelected,
    isOptionEqualToValue,
    extractValue,
    groupBy,
    handleBlur,
  } = usePersonaSelect(indexPersona, onChange);

  return (
    <OptionsAutocomplete
      label="Seleziona una persona"
      value={lastValueSelected.current}
      deletable={false}
      creatable={false}
      isOptionEqualToValue={isOptionEqualToValue}
      optionsStore={personeStore}
      extractValue={extractValue}
      groupBy={groupBy}
      onBlur={handleBlur}
    />
  );
}

export default PersoneSelect;
