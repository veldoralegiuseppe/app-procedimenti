import { useCallback } from 'react';
import { ModelTypes } from '@shared/metadata';
import { ModelFactory } from '@ui-shared/components';

const useTransazioniPersona = () => {
  const getTransazioniPersona = useCallback((persona) => {
    if (!persona || (persona.type !== ModelTypes.PERSONA_FISICA && persona.type !== ModelTypes.PERSONA_GIURIDICA)) {
      throw new Error('Persona is required');
    }

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
