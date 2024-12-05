import * as React from 'react';
import { ImportoReadOnly, ImportoInput } from '@shared/components';
import useTransazioneConstants from './useTransazioneConstants';
import useTransazioneUtils from './useTransazioneUtils';
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
  
  const isParzialmenteSaldato = transazione.stato === statoEnums.PARZIALMENTE_SALDATO;

  return {
    id: getId(transazione),

    tipo: transazione.tipo,

    importoDovuto: {
      component: disabled ? ImportoReadOnly : ImportoInput,
      value: transazione.importoDovuto,
      sx: { width: '12rem' },
      //selectorMeta: {methodName: 'getItemPropertyAndDependencies', params: {index, key: 'importoDovuto.value', dependencies: ['stato.value']}},
      backgroundColor: !disabled ? 'transparent' : '#cacaca29',
      onBlur: disabled ? () => {} : (value) =>  onChange({importoDovuto: value})
    },

    importoCorrisposto: {
      component: ImportoInput,
      disabled,
      //selectorMeta: {methodName: 'getItemPropertyAndDependencies', params: {index, key: 'importoCorrisposto.value', dependencies: ['stato.value']}},
      value: transazione.importoCorrisposto,
      sx: { width: '12rem' },
      backgroundColor: isParzialmenteSaldato ? 'transparent' : '#cacaca29',
      onBlur: disabled
        ? () => {}
        : (value) =>  onChange({importoCorrisposto: value})
    },

    stato: {
      value: transazione.stato,
      status: statoChipFlagMap[transazione.stato],
      tooltipMessage: "prova",
      sx: { minWidth: '92.3px' },
      nextStateFn: getNextStatus,
      onClick: (change) => onChange({stato: flagColorToStatoMap[change?.stato]})
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
  const { getNextStatus, getId } = useTransazioneUtils({statoChipFlagMap, disabled, statoEnums});
  
  // Funzione per mappare una transazione a una riga
  const mapRow = React.useCallback(
    ({ transazione, index }) =>
      mapToRow({
        transazione,
        onChange: (changes) => handleChange({changes, index }),
        disabled: disabled?.includes((nome) => nome?.toUpperCase() === transazione.nome?.toUpperCase()),
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
    () => transazioni.map((transazione, index) => mapRow({ transazione, index })),
    [transazioni, mapRow]
  );

  // Gestione delle modifiche
  const handleChange = React.useCallback(({ changes, index }) => {
    console.log('handleChange', changes, index);
    onChange?.(index, changes);
  }, [onChange]);

  return { data, handleChange };
};

export default useTransazioneTableRow;

export { useTransazioneTableRow };
