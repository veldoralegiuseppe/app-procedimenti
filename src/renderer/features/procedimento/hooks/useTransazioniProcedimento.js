import { useMemo, useCallback } from 'react';
import { useStoreContext } from '@ui-shared/context';
import { useProcedimentoStore } from '@features/procedimento';
import { usePersoneStore } from '@features/persona';
import { FieldTypes } from '@ui-shared/metadata';
import { ModelTypes } from '@shared/metadata';

const useTransazioniProcedimento = () => {
  // Store
  const owner = ModelTypes.PROCEDIMENTO;
  const stores = useStoreContext();
  const procedimentoStore = stores[ModelTypes.PROCEDIMENTO];
  const personeStore = stores[FieldTypes.PERSONE];

  const { getTransazioni: getTransazioniProcedimento } =
    useProcedimentoStore(procedimentoStore);
  const { getIncassi } = usePersoneStore(personeStore);

  const getTransazioni = useCallback(() => {
    const transazioniProcedimento = getTransazioniProcedimento();
    const incassiPersoneComplessivi = getIncassi();

    const transazioni = [
      ...incassiPersoneComplessivi,
      ...transazioniProcedimento,
    ].map((t) => ({ ...t, owner }));

    //console.log('transazioniProcedimento', transazioni)
    return transazioni;
  }, [getTransazioniProcedimento, getIncassi, owner]);

  return { getTransazioni };
};

export default useTransazioniProcedimento;
