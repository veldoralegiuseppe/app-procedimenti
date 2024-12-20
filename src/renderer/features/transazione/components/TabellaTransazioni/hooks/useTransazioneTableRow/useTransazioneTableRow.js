import * as React from 'react';
import { ImportoInput } from '@shared/components';
import useTransazioneConstants from './useTransazioneConstants';
import useTransazioneUtils from './useTransazioneUtils';
import { useStoreContext } from '@shared/context';
import { useModelStore } from '@shared/hooks';
import _ from 'lodash';

/**
 * Mappa una transazione in una riga della tabella.
 * @param {Object} params - Parametri per mappare una riga.
 * @returns {Object} Rappresentazione della riga.
 */
const mapToRow = ({
  transazione,
  onChange,
  disabled,
  errors,
  getNextStatus,
  flagColorToStatoMap,
  statoEnums,
  statoChipFlagMap,
  getId,
  index,
}) => {
  const isParzialmenteSaldato =
    transazione.stato === statoEnums.PARZIALMENTE_SALDATO;

  return {
    id: getId(transazione),

    tipo: transazione.tipo,

    importoDovuto: {
      component: ImportoInput,
      disabled,
      value: transazione.importoDovuto,
      fieldKey: `${transazione.key}.importoDovuto`,
      owner: transazione.owner,
      sx: { width: '12rem' },
      backgroundColor: !disabled ? 'transparent' : '#cacaca29',
      onBlur: disabled
        ? () => {}
        : (value) => onChange({ importoDovuto: value }),

      dependencies: {
        importoDovuto: {
          namespace: `${transazione.key}`,
          callback: ({ key, oldValue, newValue, props, store }) => {
            return {
              value: newValue,
            };
          },
        },
      },
    },

    importoCorrisposto: {
      component: ImportoInput,
      disabled,
      owner: transazione.owner,
      fieldKey: `${transazione.key}.importoCorrisposto`,
      dependencies: {
        stato: {
          namespace: `${transazione.key}`,
          callback: ({ key, oldValue, newValue, props, store }) => {
            const model = store.getState().model[transazione.key];

            if (newValue === statoEnums.SALDATO)
              return { disabled: true, value: model.importoDovuto };
            else return { disabled: false, value: 0 };
          },
        },
        importoCorrisposto: {
          namespace: `${transazione.key}`,
          callback: ({ key, oldValue, newValue, props, store }) => {
            return {
              value: newValue,
            };
          },
        },
      },
      value: transazione.importoCorrisposto,
      sx: { width: '12rem' },
      backgroundColor: isParzialmenteSaldato ? 'transparent' : '#cacaca29',
      onBlur: disabled
        ? () => {}
        : (value) => onChange({ importoCorrisposto: value }),
    },

    stato: {
      value: transazione.stato,
      status: statoChipFlagMap[transazione.stato],
      owner: transazione.owner,
      statusLabelMap: statoChipFlagMap,
      sx: { minWidth: '92.3px' },
      fieldKey: `${transazione.key}.stato`,
      dependencies: {
        importoCorrisposto: {
          namespace: `${transazione.key}`,
          callback: ({ key, oldValue, newValue, props, store }) => {
            //console.log('importoCorrisposto', key, oldValue, newValue, props);
            const model = store.getState().model[transazione.key];
            const stato = model.stato;

            if (stato === statoEnums.PARZIALMENTE_SALDATO)
              return `Rimanente: € ${model.importoDovuto - newValue}`;
            else return '';
          },
        },
        importoDovuto: {
          namespace: `${transazione.key}`,
          callback: ({ key, oldValue, newValue, props, store }) => {
            const model = store.getState().model[transazione.key];
            const stato = model.stato;

            if (stato === statoEnums.PARZIALMENTE_SALDATO)
              return `Rimanente: € ${newValue - model.importoCorrisposto}`;
            else return '';
          },
        },
      },
      nextStateFn: getNextStatus,
      disabled,
      onClick: disabled
        ? () => {}
        : (change) => onChange({ stato: flagColorToStatoMap[change?.stato] }),
    },
  };
};

/**
 * Custom hook per gestire lo stato delle righe della tabella delle transazioni.
 * @param {Transazione[]} transazioni - Array di transazioni iniziali.
 * @returns {Object} Stato e metodi per gestire le righe.
 */
const useTransazioneTableRow = ({
  transazioni,
  disabled,
  onChange,
  onBlur,
  errors,
}) => {
  const { statoChipFlagMap, flagColorToStatoMap, statoEnums } = useTransazioneConstants();
  const ownerStore = useStoreContext(transazioni[0]?.owner);
  const {setProperty} = useModelStore(ownerStore);

  const { getNextStatus, getId } = useTransazioneUtils({
    statoChipFlagMap,
    disabled,
    statoEnums,
  });

  // Funzione per mappare una transazione a una riga
  const mapRow = React.useCallback(
    ({ transazione, index }) =>
      mapToRow({
        transazione,
        onChange: (changes) => handleChange({ changes, index }),
        disabled: disabled?.some(
          (nome) => nome?.toUpperCase() === transazione.nome?.toUpperCase()
        ),
        errors,
        getNextStatus: (label) => getNextStatus(transazione, label),
        flagColorToStatoMap,
        statoEnums,
        statoChipFlagMap,
        getId,
        index,
      }),
    [disabled, errors, getNextStatus]
  );

  // Genera i dati per la tabella
  const data = React.useMemo(
    () =>
      transazioni.map((transazione, index) => mapRow({ transazione, index })),
    [transazioni, mapRow]
  );

  // Gestione delle modifiche
  const handleChange = React.useCallback(
    ({ changes, index }) => {
      const updatedTransazione = transazioni[index];
      //console.log('handleChange', changes, index, updatedTransazione);
      //console.log('onChange', updatedTransazione.key, changes);
      setProperty?.(updatedTransazione.key, changes);
      onChange?.(index, updatedTransazione.key, changes);
    },
    [onChange]
  );

  return { data, handleChange };
};

export default useTransazioneTableRow;

export { useTransazioneTableRow };
