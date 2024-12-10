import { useMemo } from 'react';
import { ModelFactory } from '@shared/factories';
import { FieldTypes } from '@shared/metadata';

const useTransazioniProcedimento = () => {
  // Store
  const owner = FieldTypes.PROCEDIMENTO;

  // Initializzazione delle transazioni
  const initialTransazioni = useMemo(() => {

    const getInitialTransazioni = () => {
      const metadata = ModelFactory.getMetadata(FieldTypes.PROCEDIMENTO).metadata;
      const transazioni = Object.values(metadata)
        .filter((m) => m.type === FieldTypes.TRANSAZIONE)
        .map((m) => ModelFactory.create({ type: FieldTypes.TRANSAZIONE, version: m.version, initialValues: m.default }));
  
      return transazioni;
    }

    const incassoParti = ModelFactory.create({
      initialValues: {
        nome: 'Incasso parti',
        tipo: 'ENTRATA',
      },
      type: FieldTypes.TRANSAZIONE,
    });

    const incassoControparti = ModelFactory.create({
      initialValues: {
        nome: 'Incasso controparti',
        tipo: 'ENTRATA',
      },
      type: FieldTypes.TRANSAZIONE,
    });

    const restTransazioni = getInitialTransazioni();

    const transazioni = [
      incassoParti,
      incassoControparti,
      ...restTransazioni,
    ].map((t) => ({ ...t, owner }));
    console.log('initial transazioni', transazioni);
    return transazioni;
  }, []);

  return { transazioni: initialTransazioni };
};

export { useTransazioniProcedimento };
