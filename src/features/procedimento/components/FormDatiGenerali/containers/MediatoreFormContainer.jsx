import * as React from 'react';
import { ModelFactory } from '@shared/factories';
import { FieldTypes } from '@shared/metadata';
import { useMetadata } from '@shared/hooks';
import { useStoreContext } from '@shared/context';
import { FormPresenter } from '@shared/components';

const MediatoreFormContainer = () => {
 
  const { procedimentoStore } = useStoreContext();

  const commonSx = { width: '29.2rem' };
  const { metadata } = useMetadata({
    type: FieldTypes.PROCEDIMENTO,
    keysOrSection: ModelFactory.getMetadata(FieldTypes.PROCEDIMENTO).enums.sezione.MEDIATORE,
    overrides: {
      nomeMediatore: { sx: commonSx },
      cognomeMediatore: { sx: commonSx },
    },
  });

  const inputPropsArray = Object.values(metadata).map((value) => ({
    ...value,
    store: procedimentoStore,
  }));


  return (
    <FormPresenter
      titolo="Mediatore"
      inputPropsArray={inputPropsArray}
    />
  );
};

export default MediatoreFormContainer;
