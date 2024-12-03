import * as React from 'react';
import { ModelFactory } from '@shared/factories';
import { FieldTypes } from '@shared/metadata';
import { useMetadata } from '@shared/hooks';
import { useStoreContext } from '@shared/context';
import { FormPresenter } from '@shared/components';

const IncontroFormContainer = () => {
  const { procedimentoStore } = useStoreContext();

  const commonSx = { width: '29.2rem' };
  const { metadata } = useMetadata({
    type: FieldTypes.PROCEDIMENTO,
    keysOrSection: ModelFactory.getMetadata(FieldTypes.PROCEDIMENTO).enums
      .sezione.FISSAZIONE_INCONTRO,
    overrides: {
      modalitaSvolgimento: { sx: commonSx },
    },
  });

  const inputPropsArray = Object.values(metadata).map((value) => ({
    ...value,
    store: procedimentoStore,
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
