import * as React from 'react';
import { useMetadata } from '@ui-shared/hooks';
import { ModelTypes } from '@shared/metadata';
import { FormPresenter, ModelFactory } from '@ui-shared/components';
import { useCreateStore, useModelArray } from '@ui-shared/hooks';

const IstanzaFormContainer = () => {
  
  const commonSx = { width: '29.2rem' };
  const sedeStore = useCreateStore({ storeInterface: useModelArray });
 

  const { metadata } = useMetadata({
    type: ModelTypes.PROCEDIMENTO,
    keysOrSection: ModelFactory.getMetadata(ModelTypes.PROCEDIMENTO).enums
      .sezione.ISTANZA_MEDIAZIONE,
    overrides: {
      sedeDeposito: {
        sx: commonSx,
        optionsStore: sedeStore,
      },
      sedeSvolgimento: {
        sx: commonSx,
        optionsStore: sedeStore,
      },
      oggettoControversia: { sx: commonSx },
      esitoMediazione: { sx: commonSx },
      causaleDemandata: { sx: commonSx },
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

  console.log('inputPropsArray', inputPropsArray);

  return (
    <FormPresenter
      titolo="Istanza di mediazione"
      inputPropsArray={inputPropsArray}
      type={metadata.type}
    />
  );
};

export default IstanzaFormContainer;
