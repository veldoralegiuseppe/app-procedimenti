import { useRicercaStore } from '@features/ricerca';
import { useStoreContext } from '@ui-shared/context';
import { StoreTypes } from '@ui-shared/metadata';
import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { getTransazioniProcedimento } from '@features/procedimento';
import _ from 'lodash';

const useSelectPersona = (index) => {
  const [indexSelezionata, setIndexSelezionata] = useState(_.isNumber(index) ? index : null);

  const handleSelect = useCallback(
    (index) => {
      setIndexSelezionata(index);
    },
    [setIndexSelezionata]
  );

  return {
   indexSelezionata,
   handleSelect
  };
};

const useTab = (activeIndex, open) => {
  const [activeTab, setActiveTab] = useState(activeIndex);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  useEffect(() => {
    if (!open) {
      setActiveTab(0);
    }
  }, [open]);

  return {
    activeTab,
    handleTabChange,
  };
};

const useRiepilogoSpese = ({ procedimento, persone, open }) => {
  
  const { activeTab, handleTabChange } = useTab(0, open);
  const { indexSelezionata: indexParteSelezionata, handleSelect: handleSelectParte } = useSelectPersona();
  const { indexSelezionata: indexControparteSelezionata, handleSelect: handleSelectControparte } = useSelectPersona();
  
  // Store
  const ricercaStore = useStoreContext(StoreTypes.RICERCA);
  const { setProcedimentoProperty, setPersonaProperty, getChangeProcedimento, getChangePersone } = useRicercaStore(ricercaStore);

  // Transazioni
  const { transazioniProcedimento = [], incassi = [], transazioniPersone = [] } = 
  getTransazioniProcedimento(procedimento, persone);

  const handleChangeProcedimento = useCallback(
    (index, key, changes) => {
      setProcedimentoProperty({ key, value: changes });
    },
    [setProcedimentoProperty]
  );

  const handleChangeParte = useCallback(
    (index, key, changes) => {
      if(_.isNumber(indexParteSelezionata))
        setPersonaProperty({ key, index: indexParteSelezionata, value: changes });
    },
    [setPersonaProperty, indexParteSelezionata]
  );

  const handleChangeControparte = useCallback(
    (index, key, changes) => {
      if(_.isNumber(indexControparteSelezionata))
        setPersonaProperty({ key, index: indexControparteSelezionata, value: changes });
    },
    [setPersonaProperty, indexControparteSelezionata]
  );

  // Changes 
  const procedimentoChanges = getChangeProcedimento();
  const personeChanges = getChangePersone();

  return {
    activeTab,
    handleTabChange,
    indexParteSelezionata,
    indexControparteSelezionata,
    transazioniProcedimento: _.union(incassi, transazioniProcedimento),
    transazioniParte: _.get(transazioniPersone, indexParteSelezionata, []),
    transazioniControparte: _.get(transazioniPersone, indexControparteSelezionata, []),
    handleSelectParte,
    handleSelectControparte,
    handleChangeParte,
    handleChangeControparte,
    handleChangeProcedimento,
    procedimentoChanges,
    personeChanges,
  };
};

export default useRiepilogoSpese;
