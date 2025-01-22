import { useCallback } from 'react';
import { useStoreContext } from '@ui-shared/context';
import { useProcedimentoStore } from '@features/procedimento';
import { usePersoneStore } from '@features/persona';
import { StoreTypes } from '@ui-shared/metadata';
import { ModelTypes } from '@shared/metadata';
import _ from 'lodash';

const useTransazioniProcedimento = () => {
  // Store
  const owner = ModelTypes.PROCEDIMENTO;
  const stores = useStoreContext();
  const procedimentoStore = stores[ModelTypes.PROCEDIMENTO];
  const personeStore = stores[StoreTypes.PERSONE];

  const { getTransazioni: getTransazioniProcedimento } = useProcedimentoStore(procedimentoStore);
  const { getIncassi } = usePersoneStore(personeStore);

  const getTransazioni = useCallback((override) => {
    console.log('useTransazioniProcedimento', override);
    
    let transazioniProcedimento = getTransazioniProcedimento(override?.transazioniProcedimento);
    console.log('transazioniProcedimento', transazioniProcedimento);
    
    let incassiPersoneComplessivi = getIncassi(override?.transazioniPersone);
    console.log('incassiPersoneComplessivi', incassiPersoneComplessivi);

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
