import * as React from 'react';
import { ModelTypes } from '@shared/metadata';
import { useMetadata } from '@ui-shared/hooks';
import { FormPresenter, ModelFactory } from '@ui-shared/components';

const IncontroFormContainer = () => {
  const commonSx = { width: '29.2rem' };
  const { metadata } = useMetadata({
    type: ModelTypes.PROCEDIMENTO,
    keysOrSection: ModelFactory.getMetadata(ModelTypes.PROCEDIMENTO).enums
      .sezione.FISSAZIONE_INCONTRO,
    overrides: {
      modalitaSvolgimento: { sx: commonSx },
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

  //console.log('inputPropsArray', inputPropsArray)

  return (
    <FormPresenter
      titolo="Fissazione incontro"
      inputPropsArray={inputPropsArray}
    />
  );
};

export default IncontroFormContainer;
