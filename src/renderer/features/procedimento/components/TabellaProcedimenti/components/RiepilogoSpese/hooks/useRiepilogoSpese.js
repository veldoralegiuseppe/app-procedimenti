import { useTransazioniProcedimento } from '@features/procedimento';
import { usePersoneStore } from '@features/persona';
import { useStoreContext } from '@ui-shared/context';
import { FieldTypes } from '@ui-shared/metadata';
import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import _ from 'lodash';

const useRiepilogoSpese = ({ procedimento }) => {
  const personeStore = useStoreContext(FieldTypes.PERSONE);
  const { getTransazioniPersona } = usePersoneStore(personeStore);
  const [indexPersonaSelezionata, setIndexPersonaSelezionata] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const { getTransazioni: getTransazioniProcedimento } = useTransazioniProcedimento();
  const [transazioniPersona, setTransazioniPersona] = useState([]);
  const modificheTransazioniPersona = useRef({});
  const modificheTransazioniProcedimento = useRef({});

  const transazioniProcedimento = useMemo(() => {
    let override = {};
    override['transazioniPersone'] = modificheTransazioniPersona.current;
    console.log('calcoloTransazioniProcedimento', override);

    return getTransazioniProcedimento(override);
  }, [procedimento, activeTab === 0]);

  const handleSelectPersona = useCallback(
    (index) => {
      console.log('setIndexPersona', index);
      setIndexPersonaSelezionata(index);
    },
    [setIndexPersonaSelezionata]
  );

  const handleChangeTransazionePersona = useCallback(
    (index, key, changes) => {
      setIndexPersonaSelezionata((prevIndex) => {
        if (prevIndex === null) return prevIndex;

        modificheTransazioniPersona.current = {
          ...modificheTransazioniPersona.current,
          [prevIndex]: [
            ...(modificheTransazioniPersona.current?.[prevIndex] || []).map((item) =>
              item.key === key ? { ...item, ...changes } : item
            ),
            ...(modificheTransazioniPersona.current?.[prevIndex]?.some((item) => item.key === key)
              ? []
              : [{ ...transazioniPersona[index], ...changes, key, _custom: true }]),
          ],
        };

        console.log(
          'Updated modificheTransazioniPersona',
          modificheTransazioniPersona.current
        );
        return prevIndex;
      });
    },
    [transazioniPersona]
  );

  const handleChangeTransazioneProvvedimento = useCallback(
    (index, key, changes) => {
      modificheTransazioniProcedimento.current = {
        ...modificheTransazioniProcedimento.current,
        ...changes,
      };

      console.log(
        'Updated modificheTransazioniProvvedimento',
        modificheTransazioniProcedimento.current
      );
    },
    [procedimento]
  );

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  useEffect(() => {
    if (indexPersonaSelezionata >= 0) {
      const newTransazioni =
        indexPersonaSelezionata >= 0
          ? getTransazioniPersona(
              indexPersonaSelezionata,
              modificheTransazioniPersona.current[indexPersonaSelezionata]
            )
          : [];

      console.log(
        'modificheTransazioniPersona',
        modificheTransazioniPersona.current
      );
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
