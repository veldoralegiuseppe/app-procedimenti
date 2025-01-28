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
  store,
  getMethod,
  getMethodArgs,
  rootDep,
}) => {
  
  const isParzialmenteSaldato =
    transazione.stato === statoEnums.PARZIALMENTE_SALDATO;

  const isDaSaldare = 
    transazione.stato === statoEnums.DA_SALDARE;

  const isSaldato = 
    transazione.stato === statoEnums.SALDATO;

  const isCustom = transazione._custom;
  console.log('isCustom', {id: getId(transazione), isCustom, transazione});

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
            store,
            getMethod,
            getMethodArgs,
            sx: { width: '12rem' },
            backgroundColor: !disabled ? 'transparent' : '#cacaca29',
            onBlur: disabled
              ? () => {}
              : (value) => onChange({ importoDovuto: value }),

            // dependencies: isCustom ? undefined : {
            //   importoDovuto: {
            //     namespace: `${transazione.key}`,
            //     callback: ({ key, oldValue, newValue, props, store }) => {
            //       return {
            //         value: newValue,
            //       };
            //     },
            //   },
            // },
          },

    importoCorrisposto:
      mode === ModeTypes.DETAIL
        ? ImportoUtils.formattaImporto(transazione.importoCorrisposto)
        : {
            component: ImportoInput,
            disabled: disabled || (isDaSaldare || isSaldato),
            owner: transazione.owner,
            store,
            getMethod,
            getMethodArgs,
            ...(isCustom ? {value: transazione.importoCorrisposto} : {}),
            fieldKey: `${transazione.key}.importoCorrisposto`,
            dependencies: isCustom ? undefined : {
              stato: {
                namespace: `${transazione.key}`,
                rootDep,
                callback: ({ key, oldValue, newValue, props, store }) => {
                  const model = store?.getState()?.[getMethod]?.({ key: transazione.key, ...getMethodArgs });
                  console.log('importoCorrisposto', newValue === statoEnums.SALDATO);

                  if (newValue === statoEnums.SALDATO){
                    console.log('importoCorrisposto', { disabled: true, value: model.importoDovuto });
                    return { disabled: true, value: model.importoDovuto };
                  }
                  else if(newValue === statoEnums.DA_SALDARE){
                    console.log('importoCorrisposto', { disabled: false, value: 0 });
                    return { disabled: true, value: 0 };
                  }
                  else {
                    console.log('importoCorrisposto', { disabled: false, value: 0 });
                    return { disabled: false };
                  }
                },
              },
              importoDovuto: {
                namespace: `${transazione.key}`,
                rootDep,
                callback: ({ key, oldValue: oldImportoDovuto, newValue: newImportoDovuto, props, store }) => {
                  const model = store?.getState()?.[getMethod]?.({ key: transazione.key, ...getMethodArgs });
                  const stato = model.stato;
                  const importoDovuto = model.importoDovuto;

                  console.log('useTransazioneTableRow', 'importoDovuto', 'old', oldImportoDovuto, 'new', newImportoDovuto, 'stato', stato, 'key', key);
                  if(stato === statoEnums.SALDATO && !_.isEqual(oldImportoDovuto, newImportoDovuto))
                    return { value: newImportoDovuto, disabled: true };
                  else if(stato === statoEnums.DA_SALDARE && !_.isEqual(importoDovuto, 0))
                    return { value: 0, disabled: true };
                  else if(stato === statoEnums.PARZIALMENTE_SALDATO)
                    return {disabled: false};
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
      store,
      getMethod,
      getMethodArgs,
      statusLabelMap: statoChipFlagMap,
      sx: { minWidth: '92.3px' },
      fieldKey: `${transazione.key}.stato`,
      dependencies: isCustom ? undefined :{
        importoCorrisposto: {
          namespace: `${transazione.key}`,
          rootDep,
          callback: ({ key, oldValue, newValue, props, store }) => {
            //console.log('importoCorrisposto', key, oldValue, newValue, props);
            const model = store?.getState()?.[getMethod]?.({ key: transazione.key, ...getMethodArgs });
            console.log('statoDependencies', {model, oldValue, newValue});
            const stato = model.stato;

            if (stato === statoEnums.PARZIALMENTE_SALDATO)
              return `Rimanente: € ${model.importoDovuto - newValue}`;
            else return '';
          },
        },
        importoDovuto: {
          namespace: `${transazione.key}`,
          rootDep,
          callback: ({ key, oldValue, newValue, props, store }) => {
            const model = store?.getState()?.[getMethod]?.({ key: transazione.key, ...getMethodArgs });
            const stato = model.stato;

            if (stato === statoEnums.PARZIALMENTE_SALDATO)
              return `Rimanente: € ${newValue - model.importoCorrisposto}`;
            else return '';
          },
        },
        updateTooltipByStatoChange: {
          depKey: 'stato',
          namespace: `${transazione.key}`,
          rootDep,
          callback: ({ key, oldValue, newValue: newStato, props, store }) => {
            const model = store?.getState()?.[getMethod]?.({ key: transazione.key, ...getMethodArgs });
            const importoDovuto = model.importoDovuto;
            const importoCorrisposto = model.importoCorrisposto;

            if (newStato === statoEnums.PARZIALMENTE_SALDATO)
              return `Rimanente: € ${importoDovuto - importoCorrisposto}`;
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
  store,
  updateMethod = 'setProperty',
  updateMethodArgs = {},
  getMethod = 'getProperty',
  getMethodArgs = {},
  mode,
  rootDep,
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
        store,
        getMethod,
        getMethodArgs,
        rootDep,
      }),
    [disabled, errors, getNextStatus]
  );

  const stores = useStoreContext();
  const currentTransazioni = React.useRef(transazioni);

  const existTransazioneInMetadata = (transazione) => {
    const owner = transazione?.owner;
    const metadati = owner ? ModelFactory.getMetadata(owner).metadata : null;

    console.log('existTransazioneInMetadata', {owner, metadati, transazione});

    if(!metadati) return false; 
    if(typeof transazione._custom === 'boolean') return !transazione._custom;
    return Object.values(metadati).some(m => m.type === ModelTypes.TRANSAZIONE && m.key === transazione.key);
  }

  const [data, setData] = React.useState(() => {
    const newData = transazioni.map((t, index) => mapRow({ transazione: { ...t, _custom: !existTransazioneInMetadata(t) }, index }));
      return newData;
  });

  React.useEffect(() => {
    if (!_.isEqual(currentTransazioni.current, transazioni)) {
      currentTransazioni.current = transazioni;

      setData((prevData) => {
        const newData = transazioni.map((t, index) => mapRow({ transazione: { ...t, _custom: !existTransazioneInMetadata(t) }, index }));
        console.log('prevData', prevData, 'newData', newData);
        return newData;
      });
    }
  }, [transazioni]);

  const handleChange = React.useCallback(
    ({ changes, index }) => {
      const oldTransazione = currentTransazioni.current[index];
      const newTransazione = { ...oldTransazione, ...changes };

      if(_.isEqual(oldTransazione, newTransazione)) return;

      const owner = oldTransazione.owner;
      const storeToUpdate = store || stores[owner];
      storeToUpdate?.getState()?.[updateMethod]?.({key: oldTransazione.key, value: changes, ...updateMethodArgs});
      //storeToUpdate?.getState()?.setProperty?.({key: oldTransazione.key, value: changes, namespace, predicate, root});

      //console.log('handleChange', index, oldTransazione.key, changes);
      onChange?.(index, oldTransazione.key, changes);
      currentTransazioni.current = currentTransazioni.current.map(
        (transazione, i) =>
          i === index ? { ...transazione, ...changes } : transazione
      );
    },
    [onChange, stores]
  );

  return { data: data, handleChange };
};

export default useTransazioneTableRow;

export { useTransazioneTableRow };
