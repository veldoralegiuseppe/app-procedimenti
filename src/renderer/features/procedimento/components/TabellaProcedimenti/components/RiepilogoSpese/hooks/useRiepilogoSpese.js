import { useRicercaStore } from '@features/ricerca';
import { useStoreContext } from '@ui-shared/context';
import { StoreTypes } from '@ui-shared/metadata';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { getTransazioniProcedimento } from '@features/procedimento';
import _ from 'lodash';

const useSelectPersona = () => {
  const [indexSelezionata, setIndexSelezionata] = useState(null);

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

const useRiepilogoSpese = ({ procedimento, persone: initPersone = [], open }) => {
  
  // Tab
  const { activeTab, handleTabChange } = useTab(0, open);

  // Persone
  const persone = useMemo(() => _.map(initPersone, (p,id) => ({...p, id})), [initPersone]);
  console.log('persone', persone)
  const { indexSelezionata: indexParteSelezionata, handleSelect: handleSelectParte } = useSelectPersona();
  const { indexSelezionata: indexControparteSelezionata, handleSelect: handleSelectControparte } = useSelectPersona();
  
  // Store
  const ricercaStore = useStoreContext(StoreTypes.RICERCA);
  const { setProcedimentoProperty, setPersonaProperty, getChangeProcedimento, getChangePersone } = useRicercaStore(ricercaStore);

  // Transazioni
  const { transazioniProcedimento = [], incassi = [], transazioniPersone = [] } = 
  getTransazioniProcedimento({procedimento, persone, overrides: {}});

  const transazioni = useMemo(() => ({
    transazioniProcedimento: _.union(incassi, transazioniProcedimento), 
    transazioniPersone,
    transazioniParte: _.get(transazioniPersone, indexParteSelezionata, []),
    transazioniControparte: _.get(transazioniPersone, indexControparteSelezionata, []),
  }), [_.get(procedimento, 'numProtocollo')])

  const transazioniPartiControparti = useMemo(() => ({
    transazioniParte: _.get(transazioniPersone, indexParteSelezionata, []),
    transazioniControparte: _.get(transazioniPersone, indexControparteSelezionata, []),
  }), [transazioni.transazioniPersone, indexParteSelezionata, indexControparteSelezionata])

  console.log('transazioni', procedimento, persone, transazioniProcedimento, incassi, transazioniPersone);

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
  const personeChanges = getChangePersone()

  // OnClose
  useEffect(() => {
    if (!open) {
      handleSelectParte(null);
      handleSelectControparte(null);
    }
  }, [open])

  return {
    activeTab,
    handleTabChange,
    indexParteSelezionata,
    indexControparteSelezionata,
    transazioniProcedimento: transazioni.transazioniProcedimento,
    transazioniParte: transazioniPartiControparti.transazioniParte,
    transazioniControparte: transazioniPartiControparti.transazioniControparte,
    handleSelectParte,
    handleSelectControparte,
    handleChangeParte,
    handleChangeControparte,
    handleChangeProcedimento,
    procedimentoChanges,
    personeChanges,
    persone,
  };
};

export default useRiepilogoSpese;
