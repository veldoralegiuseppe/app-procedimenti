import { useTransazioniProcedimento } from '@features/procedimento';
import { getTransazioniPersona, usePersone } from '@features/persona';
import { useStoreContext } from '@ui-shared/context';
import { FieldTypes } from '@ui-shared/metadata';
import { useCreateStore } from '@ui-shared/hooks';
import { PersonaEnumsV1 } from '@shared/metadata';
import { validators } from '@ui-shared/utils';
import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import _ from 'lodash';

const usePersoneUpdates = ({ persone = [], protocolloProcedimento }) => {
  // Persona selected
  const [indexSelezionata, setIndexSelezionata] = useState(null);

  // Transazioni
  const [transazioniPersona, setTransazioniPersona] = useState([]);
  const updatesTransazioni = useRef({});
  if (protocolloProcedimento)
    updatesTransazioni.current[protocolloProcedimento] =
      updatesTransazioni.current[protocolloProcedimento] || {};

  const handleSelect = useCallback(
    (index) => {
      setIndexSelezionata(() => {
        if (index === null) {
          setTransazioniPersona([]);
          return null;
        }

        const newPersonaSelezionata = _.get(persone, index);
        const indexPersone = newPersonaSelezionata._personeIndex;

        const newTransazioni = getTransazioniPersona(
          newPersonaSelezionata,
          updatesTransazioni.current?.[protocolloProcedimento]?.[indexPersone]
        );

        setTransazioniPersona(newTransazioni);
        return index;
      });
    },
    [setIndexSelezionata, persone, protocolloProcedimento]
  );

  const addUpdate = (idPersona, transazioneUpdate) => {
    console.log('updatesTransazioni', updatesTransazioni.current);
    const updatesProcedimento =
      updatesTransazioni.current[protocolloProcedimento];
    const updates = updatesProcedimento[idPersona] || [];

    const indexTransazione = updates.findIndex((transazione) =>
      _.isEqual(transazione.key, transazioneUpdate.key)
    );

    if (indexTransazione >= 0) {
      updates[indexTransazione] = {
        ...updates[indexTransazione],
        ...transazioneUpdate,
      };
    } else {
      updates.push(transazioneUpdate);
    }

    updatesTransazioni.current[protocolloProcedimento][idPersona] = updates;
  };

  const handleChangeTransazione = useCallback(
    (index, key, changes) => {
      setIndexSelezionata((prevIndex) => {
        if (prevIndex === null) return prevIndex;
        const personaSelezionata = _.get(persone, prevIndex);
        const indexPersone = personaSelezionata._personeIndex;
        const newTransazione = {
          ...transazioniPersona[index],
          ...changes,
          key,
          _custom: true,
        };

        addUpdate(indexPersone, newTransazione);
        return prevIndex;
      });
    },
    [transazioniPersona, persone, protocolloProcedimento]
  );

  useEffect(() => {
    handleSelect(null);
  }, [protocolloProcedimento]);

  return {
    handleSelect,
    handleChangeTransazione,
    indexSelezionata,
    transazioniPersona,
    updatesTransazioni,
  };
};

const useRiepilogoSpese = ({ procedimento }) => {
  // Tab
  const [activeTab, setActiveTab] = useState(0);

  // NumProtocollo
  const protocolloProcedimento =
    validators.isProtocollo(procedimento?.numProtocollo) === true
      ? procedimento.numProtocollo
      : null;

  // Persone
  const personeStore = useStoreContext(FieldTypes.PERSONE);
  const persone = personeStore((state) => state.items)?.map(
    (persona, index) => ({ ...persona, _personeIndex: index })
  );
  const parti = persone.filter(
    (persona) => persona.ruolo === PersonaEnumsV1.ruolo.PARTE_ISTANTE
  );
  const controparti = persone.filter(
    (persona) => persona.ruolo === PersonaEnumsV1.ruolo.CONTROPARTE
  );
  const storeParti = useCreateStore({
    storeInterface: usePersone,
    initialItems: parti || [],
  });
  const storeControparti = useCreateStore({
    storeInterface: usePersone,
    initialItems: controparti || [],
  });

  const {
    handleSelect: handleSelectParte,
    indexSelezionata: indexParteSelezionata,
    transazioniPersona: transazioniParte,
    handleChangeTransazione: handleChangeTransazioneParte,
    updatesTransazioni: updatesTransazioniParti,
  } = usePersoneUpdates({ persone: parti, protocolloProcedimento });
  const {
    handleSelect: handleSelectControparte,
    indexSelezionata: indexControparteSelezionata,
    transazioniPersona: transazioniControparte,
    handleChangeTransazione: handleChangeTransazioneControparte,
    updatesTransazioni: updatesTransazioniControparti,
  } = usePersoneUpdates({ persone: controparti, protocolloProcedimento });

  // Procedimento
  const { getTransazioni: getTransazioniProcedimento } =
    useTransazioniProcedimento();
  const transazioniProcedimento = useMemo(() => {
    if (!protocolloProcedimento) return [];

    let override = {};
    override['transazioniPersone'] = {
      ...updatesTransazioniControparti.current[protocolloProcedimento],
      ...updatesTransazioniParti.current[protocolloProcedimento],
    };

    return getTransazioniProcedimento(override);
  }, [protocolloProcedimento, activeTab === 0, getTransazioniProcedimento]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return {
    activeTab,
    handleTabChange,
    indexParteSelezionata,
    indexControparteSelezionata,
    transazioniProcedimento,
    transazioniParte,
    transazioniControparte,
    handleSelectParte,
    handleSelectControparte,
    handleChangeTransazioneParte,
    handleChangeTransazioneControparte,
    storeParti,
    storeControparti,
  };
};

export default useRiepilogoSpese;
