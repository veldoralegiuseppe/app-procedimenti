import { useCallback } from 'react';
import { ModelTypes } from '@shared/metadata';
import { ModelFactory } from '@ui-shared/components';

const useTransazioniPersona = () => {
  const personeStore = useStoreContext(FieldTypes.PERSONE);
  const { getItem } = usePersoneStore(personeStore);

  const getTransazioniPersona = useCallback((index) => {
   const persona = getItem(index);
   const owner = persona.type;

    return Object.values(persona || {})
      .filter((field) => field?.type === ModelTypes.TRANSAZIONE)
      .map((t) =>
        ModelFactory.create({
          type: ModelTypes.TRANSAZIONE,
          initialValues: { ...t, owner: t.owner || owner },
          version: t.version,
        })
      );
  }, []);

  return { getTransazioniPersona };
};

export default useTransazioniPersona;
