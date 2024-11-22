import { useEffect, useState, useContext } from 'react';
import { Transazione } from '@model/transazione';
import { SEZIONI } from '@model/procedimento';
import { ProcedimentoContext } from '@context/Procedimento';

const useTransazioniProcedimento = (procedimento) => {
  const [transazioni, setTransazioni] = useState([]);
  const [totali, setTotali] = useState([]);
  const { handleInputChange } = useContext(ProcedimentoContext);

  useEffect(() => {
    const incassoParti = new Transazione({
      nome: 'Incasso parti',
      tipo: 'entrata',
    });
    const incassoControparti = new Transazione({
      nome: 'Incasso controparti',
      tipo: 'entrata',
    });

    setTransazioni([
      incassoParti,
      incassoControparti,
      procedimento.compensoMediatore,
      procedimento.speseAvvioSedeSecondaria,
      procedimento.speseIndennitaSedeSecondaria,
    ]);
  }, [
    procedimento.compensoMediatore,
    procedimento.speseAvvioSedeSecondaria,
    procedimento.speseIndennitaSedeSecondaria,
  ]);

  useEffect(() => {
    const totaleDovutoSedeSecondaria = {
      label: 'Totale spese sede secondaria',
      value:
        procedimento.speseAvvioSedeSecondaria.importoDovuto +
        procedimento.speseIndennitaSedeSecondaria.importoDovuto,
    };

    const totaleUscita = {
      label: 'Totale spese',
      value: transazioni.reduce(
      (acc, transazione) =>
        transazione.tipo.toLowerCase() === 'uscita' ? acc + transazione.importoDovuto : acc,
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
  }, [transazioni, procedimento]);

  return { transazioni, totali };
};

export { useTransazioniProcedimento };
