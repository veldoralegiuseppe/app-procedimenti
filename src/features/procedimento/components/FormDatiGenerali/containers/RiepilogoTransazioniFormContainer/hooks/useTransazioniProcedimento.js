import { useEffect, useState } from 'react';
import { useProcedimentoStore } from '@features/procedimento';
import { ModelFactory } from '@shared/factories';
import { useStoreContext } from '@shared/context';

const useTransazioniProcedimento = () => {
  // Store
  const { procedimentoStore } = useStoreContext();
  const { getTransazioni } = useProcedimentoStore(procedimentoStore);

  // State
  const [transazioni, setTransazioni] = useState(() => {
    const incassoParti = ModelFactory.create({
      initialValue: {
        nome: 'Incasso parti',
        tipo: 'ENTRATA',
      },
      type: 'transazione',
    });

    const incassoControparti = ModelFactory.create({
      initialValue: {
        nome: 'Incasso controparti',
        tipo: 'ENTRATA',
      },
      type: 'transazione',
    });

    const restTransazioni = getTransazioni();

    return [incassoParti, incassoControparti, ...restTransazioni];
  });
  const [totali, setTotali] = useState([]);

  useEffect(() => {
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
            ? acc + transazione.importoDovuto
            : acc,
        0
      ),
    };

    const totaleEntrata = {
      label: 'Totale incassi',
      value: transazioni.reduce(
        (acc, transazione) =>
          transazione.tipo.toLowerCase() === 'entrata'
            ? acc + transazione.importoDovuto
            : acc,
        0
      ),
    };

    setTotali([totaleDovutoSedeSecondaria, totaleUscita, totaleEntrata]);
  }, [transazioni]);

  return { transazioni, totali };
};

export { useTransazioniProcedimento };
