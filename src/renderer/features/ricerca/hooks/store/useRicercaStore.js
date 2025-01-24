import { useCallback } from 'react';
import { useModelStore } from '@ui-shared/hooks';

const useRicercaStore = (store) => {
  const modelStoreInterface = useModelStore(store);
  const setQuery = useCallback((props) => store?.getState()?.setQuery(props), [store]);
  const setQueryResult = useCallback((props) => store?.getState()?.setQueryResult(props), [store]);
  const getQueryResult = useCallback((props) => store(state => state?.getQueryResult(props)), [store]);
  const setProcedimento = useCallback((props) => store?.getState()?.setProcedimento(props), [store]);
  const setProcedimentoProperty = useCallback((props) => store?.getState()?.setProcedimentoProperty(props), [store]);
  const getProcedimento = useCallback(() => store?.(state => state?.getProcedimento()), [store]);
  const setPersone = useCallback((props) => store?.getState()?.setPersone(props), [store]);
  const setPersonaProperty = useCallback((props) => store?.getState()?.setPersonaProperty(props), [store]);
  const getPersone = useCallback(() => store?.(state => state?.getPersone()), [store]);
  const getChangeProcedimento = useCallback(() => store?.(state => state?.getChangeProcedimento()), [store]);
  const getChangePersone = useCallback(() => store?.(state => state?.getChangePersone()), [store]);
  
  return { 
    ...modelStoreInterface,
    setQuery,
    setQueryResult,
    getQueryResult,
    setProcedimento,
    setProcedimentoProperty,
    getProcedimento,
    setPersone,
    setPersonaProperty,
    getPersone,
    getChangeProcedimento,
    getChangePersone,
  };
};

export default useRicercaStore;
