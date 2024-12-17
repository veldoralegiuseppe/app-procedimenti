import * as React from 'react';
import { FieldTypes } from '@shared/metadata';
import { useMetadata } from '@shared/hooks';
import { FormPresenter, ModelFactory } from '@shared/components';

const MediatoreFormContainer = () => {
  const commonSx = { width: '29.2rem' };
  
  const { metadata } = useMetadata({
    type: FieldTypes.PROCEDIMENTO,
    keysOrSection: ModelFactory.getMetadata(FieldTypes.PROCEDIMENTO).enums
      .sezione.MEDIATORE,
    overrides: {
      nomeMediatore: { sx: commonSx },
      cognomeMediatore: { sx: commonSx },
    },
  });

  const inputPropsArray = Object.entries(metadata)
    .filter(([key, value]) => typeof value === 'object')
    .map(([key, value]) => ({
      ...value,
      //store: procedimentoStore, viene individuato mediante mapping nel contesto centrale
      //onChange: (changes) => console.log(changes)
      owner: metadata.type,
    }));

  return <FormPresenter titolo="Mediatore" inputPropsArray={inputPropsArray} />;
};

export default MediatoreFormContainer;
