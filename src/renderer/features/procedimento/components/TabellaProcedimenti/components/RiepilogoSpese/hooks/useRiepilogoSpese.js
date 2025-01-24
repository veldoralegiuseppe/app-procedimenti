import { useTransazioniProcedimento } from '@features/procedimento';
import { getTransazioniPersona, usePersone } from '@features/persona';
import { useRicercaStore } from '@features/ricerca';
import { useStoreContext } from '@ui-shared/context';
import { StoreTypes } from '@ui-shared/metadata';
import { useCreateStore } from '@ui-shared/hooks';
import { PersonaEnumsV1 } from '@shared/metadata';
import { validators } from '@ui-shared/utils';
import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import _ from 'lodash';

const NAMESPACE_TRANSAZIONI = 'transazioni';
const NAMESPACE_PARTI = 'parti';
const NAMESPACE_CONTROPARTI = 'controparti';

const useChangeContext = () => {
  // Store
  const ricercaStore = useStoreContext(StoreTypes.RICERCA);
  const { getUpdate, setUpdate } = useRicercaStore(ricercaStore);

  const getChanges = ({ type, protocolloProcedimento }) => {
    let path;
    let predicate;

    switch (type) {
      case 'parti':
        path = [protocolloProcedimento];
        predicate = (persona, index) => persona?.ruolo === 'PARTE_ISTANTE';
        return getUpdate('persone', path, predicate);

      case 'controparti':
        path = [protocolloProcedimento];
        predicate = (persona, index) => persona?.ruolo === 'CONTROPARTE';
        return getUpdate('persone', path, predicate);

      case 'persone':
        path = [protocolloProcedimento];
        return getUpdate('persone', path);

      default:
        return getUpdate(protocolloProcedimento);
    }
  };

  const setChange = ({
    changes,
    type,
    protocolloProcedimento,
    merge = true,
    predicate,
  }) => {
    let path;

    if (!protocolloProcedimento)
      throw new Error('Protocollo procedimento non definito');

    switch (type) {
      case 'parti':
      case 'controparti':
      case 'persone':
        path = [protocolloProcedimento];
        return setUpdate(changes, 'persone', path, merge, predicate);

      default:
        return setUpdate(
          changes,
          protocolloProcedimento,
          null,
          merge,
          predicate
        );
    }
  };

  const getTransazioniChanges = ({ type, protocolloProcedimento }) => {
    const changes = getChanges(type, protocolloProcedimento);

    return _.filter(
      changes,
      (change) => change?.type === ModelTypes.TRANSAZIONE
    );
  };

  const setTransazioneChange = ({
    changes,
    type,
    protocolloProcedimento,
    key,
  }) => {
    const predicate = (value) =>
      value?.type === ModelTypes.TRANSAZIONE && value?.key === key;
    setChange({ changes, type, protocolloProcedimento, predicate });
  };

  return {
    getTransazioniChanges,
    setTransazioneChange,
  };
};

const usePersoneUpdates = ({ persone = [], protocolloProcedimento, open }) => {
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
    const updatesProcedimento =
      updatesTransazioni.current[protocolloProcedimento];
    const updates = updatesProcedimento[idPersona] || [];

    const indexTransazione = updates.findIndex((transazione) =>
      _.isEqual(transazione.key, transazioneUpdate.key)
    );

    if (indexTransazione >= 0) {
      const transazioneToCompare = _.omit(
        transazioniPersona[indexTransazione],
        '_custom'
      );
      const newTransazioneToCompare = _.omit(transazioneUpdate, '_custom');

      if (_.isEqual(transazioneToCompare, newTransazioneToCompare)) {
        const newUpdates = updates.filter(
          (transazione, i) => i !== indexTransazione
        );
        updates = newUpdates;
      } else {
        updates[indexTransazione] = {
          ...updates[indexTransazione],
          ...transazioneUpdate,
        };
      }
    } else {
      updates.push(transazioneUpdate);
    }

    updatesTransazioni.current = {
      ...updatesTransazioni.current,
      [protocolloProcedimento]: {
        ...updatesTransazioni.current[protocolloProcedimento],
        [idPersona]: updates,
      },
    };
    //console.log('updatesTransazioni', updatesTransazioni.current);
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
    [transazioniPersona, persone, protocolloProcedimento, updatesTransazioni]
  );

  useEffect(() => {
    handleSelect(null);
  }, [protocolloProcedimento]);

  useEffect(() => {
    if (!open) {
      handleSelect(null);
    }
  }, [open]);

  return {
    handleSelect,
    handleChangeTransazione,
    indexSelezionata,
    transazioniPersona,
    updatesTransazioni,
  };
};

const useRiepilogoSpese = ({ procedimento, open }) => {
  // Tab
  const [activeTab, setActiveTab] = useState(0);

  // Store
  const ricercaStore = useStoreContext(StoreTypes.RICERCA);
  const { getUpdate } = useRicercaStore(ricercaStore);

  // NumProtocollo
  const protocolloProcedimento =
    validators.isProtocollo(procedimento?.numProtocollo) === true
      ? procedimento.numProtocollo
      : null;

  // Persone
  const personeStore = useStoreContext(StoreTypes.PERSONE);
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
  } = usePersoneUpdates({ persone: parti, protocolloProcedimento, open });
  console.log('updatesTransazioniParti', updatesTransazioniParti);

  const {
    handleSelect: handleSelectControparte,
    indexSelezionata: indexControparteSelezionata,
    transazioniPersona: transazioniControparte,
    handleChangeTransazione: handleChangeTransazioneControparte,
    updatesTransazioni: updatesTransazioniControparti,
  } = usePersoneUpdates({ persone: controparti, protocolloProcedimento, open });

  // Procedimento
  const { getTransazioni: getTransazioniProcedimento } =
    useTransazioniProcedimento();
  const transazioniProcedimento = useMemo(() => {
    if (!protocolloProcedimento) return [];

    const updatesParti = getUpdate(null, [
      protocolloProcedimento,
      NAMESPACE_PARTI,
      NAMESPACE_TRANSAZIONI,
    ]);
    const updatesControparti = getUpdate(null, [
      protocolloProcedimento,
      NAMESPACE_CONTROPARTI,
      NAMESPACE_TRANSAZIONI,
    ]);

    let override = {};
    override['transazioniPersone'] = {
      ...updatesParti,
      ...updatesControparti,
    };

    return getTransazioniProcedimento(override);
  }, [protocolloProcedimento, activeTab === 0, getTransazioniProcedimento]);

  const handleChangeTransazioneProcedimento = useCallback(
    (index, key, changes) => {
      let newTransazione = {
        ...transazioniProcedimento[index],
        ...changes,
        _custom: true,
        key,
      };

      updatesTransazioniProcedimento.current[protocolloProcedimento] =
        updatesTransazioniProcedimento.current[protocolloProcedimento] || [];

      const indexTransazione = updatesTransazioniProcedimento.current[
        protocolloProcedimento
      ].findIndex((transazione) =>
        _.isEqual(transazione.key, newTransazione.key)
      );

      if (indexTransazione >= 0) {
        const transazioneToCompare = _.omit(
          transazioniProcedimento[index],
          '_custom'
        );
        const newTransazioneToCompare = _.omit(newTransazione, '_custom');

        if (_.isEqual(transazioneToCompare, newTransazioneToCompare)) {
          const newUpdates = updatesTransazioniProcedimento.current[
            protocolloProcedimento
          ].filter((transazione, i) => i !== indexTransazione);
          updatesTransazioniProcedimento.current[protocolloProcedimento] =
            newUpdates;
        } else {
          updatesTransazioniProcedimento.current[protocolloProcedimento][
            indexTransazione
          ] = newTransazione;
        }
      } else {
        updatesTransazioniProcedimento.current[protocolloProcedimento].push(
          newTransazione
        );
      }
    },
    [transazioniProcedimento, protocolloProcedimento]
  );

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
    indexParteSelezionata,
    indexControparteSelezionata,
    transazioniProcedimento,
    updatesTransazioniParti: updatesTransazioniParti.current,
    updatesTransazioniControparti: updatesTransazioniControparti.current,
    updatesTransazioniProcedimento: updatesTransazioniProcedimento.current,
    transazioniParte,
    transazioniControparte,
    handleSelectParte,
    handleSelectControparte,
    handleChangeTransazioneParte,
    handleChangeTransazioneControparte,
    handleChangeTransazioneProcedimento,
    storeParti,
    storeControparti,
  };
};

export default useRiepilogoSpese;
