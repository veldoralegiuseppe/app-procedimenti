import { useEffect, useMemo, useState } from 'react';
import { useProcedimentoStore } from '@features/procedimento';
import { ModelFactory } from '@shared/factories';
import { useStoreContext } from '@shared/context';
import isEqual from 'lodash/isEqual';

const useTransazioniProcedimento = () => {
  // Store
  const { procedimentoStore } = useStoreContext();
  const { getTransazioni } = useProcedimentoStore(procedimentoStore);

  // Initializzazione delle transazioni
  const initialTransazioni = useMemo(() => {
    const incassoParti = ModelFactory.create({
      initialValues: {
        nome: 'Incasso parti',
        tipo: 'ENTRATA',
      },
      type: 'transazione',
    });

    const incassoControparti = ModelFactory.create({
      initialValues: {
        nome: 'Incasso controparti',
        tipo: 'ENTRATA',
      },
      type: 'transazione',
    });

    const restTransazioni = getTransazioni();
    console.log('restTransazioni', restTransazioni);

    return [incassoParti, incassoControparti, ...restTransazioni];
  }, [getTransazioni]);

  // Stato
  const [transazioni, setTransazioni] = useState(initialTransazioni);
  
  // Calcolo dei totali memorizzato con `useMemo`
  const totali = useMemo(() => {
    const totaleDovutoSedeSecondaria = {
      label: 'Totale spese sede secondaria',
      value:
        transazioni
          .filter((t) =>
            String(t.nome).toLowerCase().includes('sedesecondaria')
          )
          ?.reduce((acc, prop) => acc + (prop?.importoDovuto || 0), 0) || 0,
    };

    const totaleUscita = {
      label: 'Totale spese',
      value: transazioni.reduce(
        (acc, transazione) =>
          transazione.tipo.toLowerCase() === 'uscita'
            ? acc + (transazione.importoDovuto || 0)
            : acc,
        0
      ),
    };

    const totaleEntrata = {
      label: 'Totale incassi',
      value: transazioni.reduce(
        (acc, transazione) =>
          transazione.tipo.toLowerCase() === 'entrata'
            ? acc + (transazione.importoDovuto || 0)
            : acc,
        0
      ),
    };

    return [totaleDovutoSedeSecondaria, totaleUscita, totaleEntrata];
  }, [transazioni]);

  // Sincronizzazione delle transazioni solo se necessaria
  useEffect(() => {
    const currentTransazioni = [...initialTransazioni];
    if (!isEqual(transazioni, currentTransazioni)) {
      setTransazioni(currentTransazioni);
    }
  }, [initialTransazioni, transazioni]);

  return { transazioni, totali };
};

export { useTransazioniProcedimento };
