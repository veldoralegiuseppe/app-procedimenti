import { useEffect, useState } from 'react';
import { useProcedimento } from '@features/procedimento';
import {ModelFactory} from '@shared/factories';

const useTransazioniProcedimento = () => {
  const getProperties = useProcedimento((state) => state.getProperties);
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

    const restTransazioni = getProperties([
      'compensoMediatore',
      'speseAvvioSedeSecondaria',
      'speseIndennitaSedeSecondaria',
    ]);

    return [
      incassoParti,
      incassoControparti,
      ...restTransazioni,
    ];
  });
  const [totali, setTotali] = useState([]);

  useEffect(() => {
    const totaleDovutoSedeSecondaria = {
      label: 'Totale spese sede secondaria',
      value:
        getProperties([
          'speseIndennitaSedeSecondaria',
          'speseAvvioSedeSecondaria',
        ])?.reduce((acc, prop) => acc + (prop?.importoDovuto || 0), 0) || 0,
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
