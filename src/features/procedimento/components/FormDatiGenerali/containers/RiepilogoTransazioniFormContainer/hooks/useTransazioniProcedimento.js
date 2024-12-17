import { useMemo } from 'react';
import { ModelFactory } from '@shared/components';
import { FieldTypes } from '@shared/metadata';
import { useStoreContext } from '@shared/context';
import { useProcedimentoStore } from '@features/procedimento';

const useTransazioniProcedimento = () => {
  // Store
  const owner = FieldTypes.PROCEDIMENTO;
  const procedimentoStore = useStoreContext(owner);
  const {getTransazioni} = useProcedimentoStore(procedimentoStore);
  
  // Initializzazione delle transazioni
  const initialTransazioni = useMemo(() => {

    const getInitialTransazioni = () => {
      const transazioni = getTransazioni();
      return transazioni;
    }

    // TODO: da calcolare in base allo store persone
    const incassoParti = ModelFactory.create({
      initialValues: {
        nome: 'Incasso parti',
        tipo: 'ENTRATA',
      },
      type: FieldTypes.TRANSAZIONE,
    });

    // TODO: da calcolare in base allo store persone
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
    return transazioni;
  }, []);

  return { transazioni: initialTransazioni };
};

export { useTransazioniProcedimento };
