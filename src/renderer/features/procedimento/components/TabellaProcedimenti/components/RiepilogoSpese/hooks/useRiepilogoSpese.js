import { useTransazioniProcedimento } from '@features/procedimento';
import { useTransazioniPersona, usePersoneStore } from '@features/persona';
import { useStoreContext } from '@ui-shared/context';
import { FieldTypes } from '@ui-shared/metadata';
import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import _ from 'lodash';

const useRiepilogoSpese = ({ procedimento }) => {
  const personeStore = useStoreContext(FieldTypes.PERSONE);
  const { getItem } = usePersoneStore(personeStore);
  const [indexPersonaSelezionata, setIndexPersonaSelezionata] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const { getTransazioni: getTransazioniProcedimento } =
    useTransazioniProcedimento();
  const { getTransazioniPersona } = useTransazioniPersona();
  const [transazioniPersona, setTransazioniPersona] = useState([]);
  const modificheTransazioniPersona = useRef({});

  const transazioniProcedimento = useMemo(() => {
    console.log('calcoloTransazioniProcedimento');
    return getTransazioniProcedimento();
  }, [procedimento, activeTab === 0]);

  const handleSelectPersona = useCallback(
    (index) => {
      console.log('setIndexPersona', index);
      setIndexPersonaSelezionata(index);
    },
    [setIndexPersonaSelezionata]
  );

  const handleChangeTransazionePersona = useCallback((index, key, changes) => {
    setIndexPersonaSelezionata((prevIndex) => {
      if (prevIndex === null) return prevIndex;
  
      modificheTransazioniPersona.current = {
        ...modificheTransazioniPersona.current,
        [prevIndex]: {
          ...modificheTransazioniPersona.current[prevIndex],
          [index]: {
            ...transazioniPersona[index],
            ...changes,
          },
        },
      };
  
      console.log('Updated modificheTransazioniPersona', modificheTransazioniPersona.current);
      return prevIndex;
    });
  }, [transazioniPersona]);
  

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  useEffect(() => {
    if (indexPersonaSelezionata >= 0) {
      const persona = indexPersonaSelezionata >= 0 ? getItem(indexPersonaSelezionata) : null;
      let newTransazioni = persona ? getTransazioniPersona(persona) : [];

      if(newTransazioni.length && !_.isEmpty(modificheTransazioniPersona.current)) {
        newTransazioni = newTransazioni.map((transazione, index) => {
          const modifiche = modificheTransazioniPersona.current[indexPersonaSelezionata]?.[index];
          return modifiche ? { ...transazione, ...modifiche, _custom: true } : transazione;
        });
      }

      console.log('modificheTransazioniPersona', modificheTransazioniPersona.current);
      console.log('nuoveTransazioni', newTransazioni);
      setTransazioniPersona(newTransazioni);
    }
  }, [indexPersonaSelezionata]);

  return {
    activeTab,
    handleTabChange,
    transazioniProcedimento,
    transazioniPersona,
    indexPersonaSelezionata,
    handleSelectPersona,
    handleChangeTransazionePersona,
  };
};

export default useRiepilogoSpese;
