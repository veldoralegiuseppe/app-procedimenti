import React from 'react';
import { TabellaTransazioni } from '@features/transazione';
import { usePersonaStore } from '@features/persona';
import { useStoreContext } from '@ui-shared/context';
import { ModelTypes } from '@shared/metadata';

const RiepilogoTransazioniFormContainer = ({ onChange }) => {
  const personaFisicaStore = useStoreContext(ModelTypes.PERSONA_FISICA);
  const { getTransazioni } = usePersonaStore(personaFisicaStore);
  const [transazioni] = React.useState(getTransazioni());

  return <TabellaTransazioni transazioni={transazioni} onChange={onChange} />;
};

export default RiepilogoTransazioniFormContainer;
