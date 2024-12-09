import { useCallback, useMemo, useState } from 'react';
import { useProcedimentoStore } from '@features/procedimento';
import { ModelFactory } from '@shared/factories';
import { useStoreContext } from '@shared/context';
import { FieldTypes } from '@shared/metadata';
import {TransazioneMetadata} from '@features/transazione';
import isEqual from 'lodash/isEqual';

const useTransazioniProcedimento = () => {
  // Store
  const procedimentoStore = useStoreContext(FieldTypes.PROCEDIMENTO);
  const { getTransazioni } = useProcedimentoStore(procedimentoStore);
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

  // Calcolo dei totali memorizzato con `useMemo`
  const calculateTotali = (transazioni) => {
    console.log('transazione cambiata', transazioni);
    const enums = TransazioneMetadata['1.0'].enums;

    const totaleDovutoSedeSecondaria = {
      label: 'Totale spese sede secondaria',
      value:
        transazioni
          .filter((t) =>
            String(t.key).toLowerCase().includes('sedesecondaria')
          )
          ?.reduce((acc, prop) => acc + (prop?.importoDovuto || 0), 0) || 0,
    };

    const totaleUscita = {
      label: 'Totale spese',
      value: transazioni.reduce(
        (acc, transazione) =>
          transazione.tipo === enums.tipo.USCITA
            ? acc + (transazione.importoDovuto || 0)
            : acc,
        0
      ),
    };

    const totaleEntrata = {
      label: 'Totale incassi',
      value: transazioni.reduce(
        (acc, transazione) =>
          transazione.tipo === enums.tipo.ENTRATA
            ? acc + (transazione.importoDovuto || 0)
            : acc,
        0
      ),
    };

    return [totaleDovutoSedeSecondaria, totaleUscita, totaleEntrata];
  };

  // Stato
  const [totali, setTotali] = useState(() => {
    const initialTotali = calculateTotali(initialTransazioni);
    return isEqual(totali, initialTotali) ? totali : initialTotali;
  });

  const updateTotali = useCallback(() => {
    const transazioni = getTransazioni();
    const newTotali = calculateTotali(transazioni);

    setTotali((prevTotali) => {
      if (!isEqual(prevTotali, newTotali)) {
      console.log('newTotali', newTotali);
      return newTotali;
      }
      return prevTotali;
    });
    
  }, [procedimentoStore, getTransazioni]);

  
  return { transazioni: initialTransazioni, totali, updateTotali };
};

export { useTransazioniProcedimento };
