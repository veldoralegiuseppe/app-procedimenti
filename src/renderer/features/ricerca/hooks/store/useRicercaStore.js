import { useCallback } from 'react';
import { useModelStore } from '@ui-shared/hooks';
import _ from 'lodash';

const useRicercaStore = (store) => {
  const modelStoreInterface = useModelStore(store);
  const setQuery = useCallback((props) => store?.getState()?.setQuery(props), [store]);
  const setQueryResult = useCallback((props) => store?.getState()?.setQueryResult(props), [store]);
  const getQueryResult = useCallback((props) => store?.(state => state?.getQueryResult(props)), [store]);
  const setProcedimentoAndPersone = useCallback((props) => store?.getState()?.setProcedimentoAndPersone(props), [store]);
  const setProcedimentoProperty = useCallback((props) => store?.getState()?.setProcedimentoProperty(props), [store]);
  const getProcedimento = useCallback(() => store?.(state => state?.getProcedimento()), [store]);
  const setPersonaProperty = useCallback((props) => store?.getState()?.setPersonaProperty(props), [store]);
  const getPersone = useCallback(() => store?.(state => state?.getPersone()), [store]);
  const getChangeProcedimento = useCallback(() => store?.(state => state?.getChangeProcedimento()), [store]);
  const getChangePersone = useCallback(() => store?.(state => state?.getChangePersone()), [store]);
  const getPersona = useCallback((props) => store?.(state => state?.getPersona(props)), [store]);
  const getProcedimentoProperty = useCallback((props) => store?.(state => state?.getProcedimentoProperty(props)), [store]);
  const getPersonaProperty = useCallback((props) => store?.(state => state?.getPersonaProperty(props)), [store]);
  const saveModifiche = useCallback((props) => store?.getState()?.saveModifiche(props), [store]);
  const hasModifiche = useCallback((props) => store?.getState()?.hasModifiche(props), [store]);
  const getModifiche = useCallback((props) => store?.(state => state?.getModifiche(props)), [store]);
  const getTransazioniModificate = useCallback((props) => store?.getState()?.getTransazioniModificate(props), [store]);
  
  
  return { 
    roots: _.get(store?.getState(), ['roots'], {}),
    ...modelStoreInterface,
    setQuery,
    setQueryResult,
    getQueryResult,
    setProcedimentoAndPersone,
    setProcedimentoProperty,
    getProcedimento,
    setPersonaProperty,
    getPersone,
    getChangeProcedimento,
    getChangePersone,
    getPersona,
    getProcedimentoProperty,
    getPersonaProperty,
    saveModifiche,
    hasModifiche,
    getModifiche,
    getTransazioniModificate,
  };
};

export default useRicercaStore;
