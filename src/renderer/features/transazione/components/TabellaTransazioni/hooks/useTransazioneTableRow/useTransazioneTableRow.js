import * as React from 'react';
import { ImportoInput } from '@ui-shared/components';
import useTransazioneConstants from './useTransazioneConstants';
import useTransazioneUtils from './useTransazioneUtils';
import { useStoreContext } from '@ui-shared/context';
import { ModeTypes } from '@ui-shared/metadata';
import { ImportoUtils } from '@ui-shared/utils';
import { ModelFactory } from '@ui-shared/components';
import { ModelTypes } from '@shared/metadata';
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
  mode,
}) => {
  
  const isParzialmenteSaldato =
    transazione.stato === statoEnums.PARZIALMENTE_SALDATO;

  const isCustom = transazione._custom;

  return {
    id: getId(transazione),

    tipo: transazione.tipo,

    importoDovuto:
      mode === ModeTypes.DETAIL
        ? ImportoUtils.formattaImporto(transazione.importoDovuto)
        : {
            component: ImportoInput,
            disabled,
            ...(isCustom ? {value: transazione.importoDovuto} : {}),
            fieldKey: `${transazione.key}.importoDovuto`,
            owner: transazione.owner,
            sx: { width: '12rem' },
            backgroundColor: !disabled ? 'transparent' : '#cacaca29',
            onBlur: disabled
              ? () => {}
              : (value) => onChange({ importoDovuto: value }),

            dependencies: isCustom ? undefined : {
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

    importoCorrisposto:
      mode === ModeTypes.DETAIL
        ? ImportoUtils.formattaImporto(transazione.importoCorrisposto)
        : {
            component: ImportoInput,
            disabled,
            owner: transazione.owner,
            ...(isCustom ? {value: transazione.importoCorrisposto} : {}),
            fieldKey: `${transazione.key}.importoCorrisposto`,
            dependencies: isCustom ? undefined :{
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
            //value: transazione.importoCorrisposto,
            sx: { width: '12rem' },
            backgroundColor: isParzialmenteSaldato
              ? 'transparent'
              : '#cacaca29',
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
      dependencies: isCustom ? undefined :{
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
  mode,
}) => {
  const { statoChipFlagMap, flagColorToStatoMap, statoEnums } = useTransazioneConstants();

  const { getNextStatus, getId } = useTransazioneUtils({
    statoChipFlagMap,
    disabled,
    statoEnums,
  });

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
        mode,
      }),
    [disabled, errors, getNextStatus]
  );

  const ownerStore = useStoreContext();
  const currentTransazioni = React.useRef(transazioni);
  const [data, setData] = React.useState(() => {
      const owner = currentTransazioni.current[0]?.owner;
      const metadati = owner ? ModelFactory.getMetadata(owner).metadata : null;

      const existTransazioneInMetadata = (transazione) => {
        if(!metadati) return false; 
        return Object.values(metadati).some(m => m.type === ModelTypes.TRANSAZIONE && m.key === transazione.key);
      }

      const newData = transazioni.map((t, index) => mapRow({ transazione: { ...t, _custom: !existTransazioneInMetadata(t) }, index }));
      return newData;
  });

  React.useEffect(() => {
    if (!_.isEqual(currentTransazioni.current, transazioni)) {
      currentTransazioni.current = transazioni;

      const owner = transazioni[0]?.owner;
      const metadati = owner ? ModelFactory.getMetadata(owner).metadata : null;

      const existTransazioneInMetadata = (transazione) => {
        if(!metadati) return false; 
        return Object.values(metadati).some(m => m.type === ModelTypes.TRANSAZIONE && m.key === transazione.key);
      }
    
      setData((prevData) => {
        const newData = transazioni.map((t, index) => mapRow({ transazione: { ...t, _custom: !existTransazioneInMetadata(t) }, index }));
        console.log('prevData', prevData, 'newData', newData);
        return newData;
      });
    }
  }, [transazioni]);

  const handleChange = React.useCallback(
    ({ changes, index }) => {
      const updatedTransazione = currentTransazioni.current[index];
      const owner = updatedTransazione.owner;
      const store = ownerStore[owner];

      store.getState().setProperty(updatedTransazione.key, changes);

      //setProperty?.(updatedTransazione.key, changes);
      onChange?.(index, updatedTransazione.key, changes);
      currentTransazioni.current = currentTransazioni.current.map(
        (transazione, i) =>
          i === index ? { ...transazione, ...changes } : transazione
      );
    },
    [onChange, ownerStore]
  );

  return { data: data, handleChange };
};

export default useTransazioneTableRow;

export { useTransazioneTableRow };
