
import React from 'react';
import { TabellaTransazioni } from '@features/transazione';
import { usePersonaStore } from '@features/persona';
import { useStoreContext } from '@shared/context';
import { FieldTypes } from '@shared/metadata';

const RiepilogoTransazioniFormContainer = ({onChange: onChangeCallback}) => {
    const personaFisicaStore = useStoreContext(FieldTypes.PERSONA_FISICA);
    const {getTransazioni, setProperty} = usePersonaStore(personaFisicaStore);
    const [transazioni] = React.useState(getTransazioni());
    
    const onChange = React.useCallback(
        (index, changes) => {
          console.log('onChange', transazioni[index], changes);
          const fieldKey = transazioni[index].key;
          setProperty(fieldKey, changes);
          onChangeCallback?.({ fieldKey, changes });
        },
        [transazioni]
      );

      return (
        <TabellaTransazioni
          transazioni={transazioni}
          onChange={onChange}
        />
      );
}

export default RiepilogoTransazioniFormContainer;