import React from 'react';
import { TabellaTransazioni } from '@features/transazione';
import { usePersonaStore } from '@features/persona';
import { useStoreContext } from '@ui-shared/context';
import { FieldTypes } from '@ui-shared/metadata';

const RiepilogoTransazioniFormContainer = ({ onChange }) => {
  const personaGiuridicaStore = useStoreContext(FieldTypes.PERSONA_GIURIDICA);
  const { getTransazioni } = usePersonaStore(personaGiuridicaStore);
  const [transazioni] = React.useState(getTransazioni());

  return <TabellaTransazioni transazioni={transazioni} onChange={onChange} />;
};

export default RiepilogoTransazioniFormContainer;
