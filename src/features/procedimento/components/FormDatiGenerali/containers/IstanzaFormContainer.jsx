import * as React from 'react';
import { useDynamicOptions, useMetadata } from '@shared/hooks';
import { FieldTypes } from '@shared/metadata';
import { useStoreContext } from '@shared/context';
import { ModelFactory } from '@shared/factories';
import { FormPresenter } from '@shared/components';

const IstanzaFormContainer = () => {
  const sedeDepositoCallbacks = useDynamicOptions([]);
  const sedeSvolgimentoCallbacks = useDynamicOptions([]);
  const commonSx = { width: '29.2rem' };
  //const { procedimentoStore } = useStoreContext();

  const { metadata } = useMetadata({
    type: FieldTypes.PROCEDIMENTO,
    keysOrSection: ModelFactory.getMetadata(FieldTypes.PROCEDIMENTO).enums
      .sezione.ISTANZA_MEDIAZIONE,
    overrides: {
      sedeDeposito: { ...sedeDepositoCallbacks, sx: commonSx },
      sedeSvolgimento: { ...sedeSvolgimentoCallbacks, sx: commonSx },
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
      onBlur: (changes) => console.log(changes),
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
