import { useEffect, useState } from 'react';
import { Transazione } from '@features/transazione';
import { useProcedimento } from '@features/procedimento';

const useTransazioniProcedimento = () => {
  const getProperties = useProcedimento((state) => state.getProperties);
  const [transazioni, setTransazioni] = useState(() => {
    const incassoParti = new Transazione({
      nome: 'Incasso parti',
      tipo: 'entrata',
    });
    const incassoControparti = new Transazione({
      nome: 'Incasso controparti',
      tipo: 'entrata',
    });

    const restTransazioni = getProperties([
      'compensoMediatore',
      'speseAvvioSedeSecondaria',
      'speseIndennitaSedeSecondaria',
    ]);

    return [
      incassoParti,
      incassoControparti,
      ...restTransazioni.map((t) => new Transazione({ ...t })),
    ];
  });
  const [totali, setTotali] = useState([]);

  useEffect(() => {
    const totaleDovutoSedeSecondaria = {
      label: 'Totale spese sede secondaria',
      value: getProperties([
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
