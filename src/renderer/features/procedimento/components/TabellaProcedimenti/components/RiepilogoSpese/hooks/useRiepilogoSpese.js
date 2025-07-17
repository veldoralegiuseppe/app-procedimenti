import { useRicercaStore } from '@features/ricerca';
import { useStoreContext, useUtilsContext } from '@ui-shared/context';
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
    handleSelect,
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

const useRiepilogoSpese = ({
  procedimento,
  persone: initPersone = [],
  open,
  handleClose,
}) => {
  // Tab
  const { activeTab, handleTabChange } = useTab(0, open);

  // Persone
  const persone = useMemo(
    () => _.map(initPersone, (p, id) => ({ ...p, id })),
    [initPersone]
  );
  console.log('persone', persone);
  const {
    indexSelezionata: indexParteSelezionata,
    handleSelect: handleSelectParte,
  } = useSelectPersona();
  const {
    indexSelezionata: indexControparteSelezionata,
    handleSelect: handleSelectControparte,
  } = useSelectPersona();

  // Store
  const ricercaStore = useStoreContext(StoreTypes.RICERCA);
  const {
    setProcedimentoProperty,
    setPersonaProperty,
    getChangeProcedimento,
    getChangePersone,
    getTransazioniModificate,
    saveModifiche,
    roots,
    resetModifiche,
  } = useRicercaStore(ricercaStore);

  // Transazioni
  const numProtocollo = _.get(procedimento, 'numProtocollo');
  
  let {
    transazioniProcedimento = [],
    incassi = [],
    transazioniPersone = [],
  } = getTransazioniProcedimento({ procedimento, persone, overrides: {} });
  

  const transazioni = useMemo(
    () => ({
      transazioniProcedimento: _.union(incassi, transazioniProcedimento),
      transazioniPersone,
      transazioniParte: _.get(transazioniPersone, indexParteSelezionata, []),
      transazioniControparte: _.get(
        transazioniPersone,
        indexControparteSelezionata,
        []
      ),
    }),
    [numProtocollo, incassi]
  );

  const transazioniPartiControparti = useMemo(
    () => ({
      transazioniParte: _.get(transazioniPersone, indexParteSelezionata, []),
      transazioniControparte: _.get(
        transazioniPersone,
        indexControparteSelezionata,
        []
      ),
    }),
    [
      transazioni.transazioniPersone,
      indexParteSelezionata,
      indexControparteSelezionata,
    ]
  );

 
  const handleChangeProcedimento = useCallback(
    (index, key, changes) => {
      setProcedimentoProperty({ key, value: changes });
    },
    [setProcedimentoProperty]
  );

  const handleChangeParte = useCallback(
    (index, key, changes) => {
      if (_.isNumber(indexParteSelezionata)){
        setPersonaProperty({
          key,
          index: indexParteSelezionata,
          value: changes,
        });

        const overrides =  getTransazioniModificate({ numProtocollo });
        const {incassi: newIncassi} = getTransazioniProcedimento({ procedimento, persone, overrides });
        incassi = newIncassi;
      }
    },
    [setPersonaProperty, indexParteSelezionata]
  );

  const handleChangeControparte = useCallback(
    (index, key, changes) => {
      if (_.isNumber(indexControparteSelezionata)){
        setPersonaProperty({
          key,
          index: indexControparteSelezionata,
          value: changes,
        })

        const overrides =  getTransazioniModificate({ numProtocollo });
        const {incassi: newIncassi} = getTransazioniProcedimento({ procedimento, persone, overrides });
        incassi = newIncassi;
      }
    },
    [setPersonaProperty, indexControparteSelezionata]
  );

  // Changes
  let procedimentoChanges = getChangeProcedimento();
  let personeChanges = getChangePersone();

  // OnClose
  useEffect(() => {
    if (!open) {
      handleSelectParte(null);
      handleSelectControparte(null);
    }
  }, [open]);

  // Buttons 
  const { notify } = useUtilsContext();

  const handleSalvaBozzaBtn = useCallback(() => {
    saveModifiche();
    handleClose?.();
    notify('Bozza salvata', 'success');
  }, [saveModifiche]);

  const handleChiudiBtn = useCallback(() => {
    handleClose?.();
  }, []);

  const isSalvaBozzaBtnDisabled = useMemo(() => {
    return _.isEmpty(procedimentoChanges) && _.isEmpty(personeChanges);
  }, [procedimentoChanges, personeChanges]);

  const handleClearBtn = useCallback((obj) => {
    resetModifiche(obj);
    procedimentoChanges = ricercaStore?.getState()?.getChangeProcedimento();
    personeChanges = ricercaStore?.getState()?.getChangePersone();
  }, [resetModifiche, ricercaStore, procedimentoChanges, personeChanges]);

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
    handleSalvaBozzaBtn,
    handleChiudiBtn,
    isSalvaBozzaBtnDisabled,
    roots,
    store: ricercaStore,  
    handleClearBtn,
  };
};

export default useRiepilogoSpese;
