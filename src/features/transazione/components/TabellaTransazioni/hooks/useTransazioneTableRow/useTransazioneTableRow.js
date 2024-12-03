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
}) => {
  
  const isParzialmenteSaldato = transazione.stato === statoEnums.PARZIALMENTE_SALDATO;

  return {
    id: getId(transazione),

    tipo: transazione.tipo,

    importoDovuto: {
      component: disabled ? ImportoReadOnly : ImportoInput,
      value: transazione.importoDovuto,
      sx: { width: '12rem' },
      backgroundColor: !disabled ? 'transparent' : '#cacaca29',
      onBlur: disabled ? () => {} : (value) => onChange('importoDovuto', value),
    },

    importoCorrisposto: {
      component: disabled
        ? ImportoReadOnly
        : isParzialmenteSaldato
        ? ImportoInput
        : ImportoReadOnly,
      value: transazione.importoCorrisposto,
      sx: { width: '12rem' },
      backgroundColor: isParzialmenteSaldato ? 'transparent' : '#cacaca29',
      onBlur: disabled
        ? () => {}
        : (value) => onChange('importoCorrisposto', value),
    },

    stato: {
      value: transazione.stato,
      status: statoChipFlagMap[transazione.stato],
      tooltipMessage: "prova",
      sx: { minWidth: '92.3px' },
      nextStateFn: getNextStatus,
      onClick: (id, change) => {
        console.log('id', id, 'change', change);
        onChange(id, {stato: flagColorToStatoMap[change?.stato]});
      },
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
        onChange: (id, changes) => handleChange({ id, changes, index }),
        disabled: disabled?.includes((nome) => nome?.toUpperCase() === transazione.nome?.toUpperCase()),
        errors,
        getNextStatus: (label) => getNextStatus(transazione, label),
        flagColorToStatoMap,
        statoEnums,
        statoChipFlagMap,
        getId,
      }),
    [disabled, errors, getNextStatus]
  );

  // Genera i dati per la tabella
  const data = React.useMemo(
    () => transazioni.map((transazione, index) => mapRow({ transazione, index })),
    [transazioni, mapRow]
  );

  // Gestione delle modifiche
  const handleChange = React.useCallback(({ id, changes, index }) => {
    console.log('handleChange', id, changes, index);
    onChange?.(index, changes);
  }, [onChange]);

  return { data, handleChange };
};

export default useTransazioneTableRow;

export { useTransazioneTableRow };
