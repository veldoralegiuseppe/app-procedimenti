import React from 'react';
import {ImportoReadOnly, ImportoInput} from '@shared/components';
import { statoChipFlagMap, Transazione } from '@features/transazione';
import _ from 'lodash';
import { useArrayStore } from '@shared/hooks';

/**
 * Mappa una transazione in una riga della tabella.
 * @param {Transazione} transazione - Oggetto transazione da mappare.
 * @param {Function} handleChange - Callback per gestire le modifiche.
 * @returns {Object} Rappresentazione della riga.
 */
const mapToRow = ({transazione, onChange, disabled, errors}) => {
  //console.log('errors', errors);
  const importoDovuto = transazione.importoDovuto;
  const importoCorrisposto = transazione.importoCorrisposto;
  const stato = transazione.stato;

  const isParzialmenteSaldato =
    transazione.stato === Transazione.stati.PARZIALMENTE_SALDATO;

  const tooltipMessage = (() => {
    if (disabled) return 'Calcolato automaticamente';
    else if (isParzialmenteSaldato)
      return `Rimanente: € ${
        transazione.importoDovuto - transazione.importoCorrisposto
      }`;
    else return '';
  })();

  return {
    id: getId(transazione),

    tipo: transazione.tipo,

    importoDovuto: {
      component: disabled ? ImportoReadOnly : ImportoInput,
      value: importoDovuto,
      sx: { width: '12rem' },
      backgroundColor: !disabled ? 'transparent' : '#cacaca29',
      onBlur: disabled
        ? () => {}
        : (value) => onChange('importoDovuto', value),
    },

    importoCorrisposto: {
      component: disabled
        ? ImportoReadOnly
        : isParzialmenteSaldato
        ? ImportoInput
        : ImportoReadOnly,
        value: importoCorrisposto,
      sx: { width: '12rem' },
      backgroundColor: isParzialmenteSaldato ? 'transparent' : '#cacaca29',
      onBlur: disabled
        ? () => {}
        : (value) => onChange('importoCorrisposto', value),
    },

    stato: {
      value: stato,
      status: statoChipFlagMap[stato],
      tooltipMessage: tooltipMessage,
      sx: { minWidth: '92.3px' },
      onClick: disabled
        ? () => {}
        : () => onChange('stato', getNextStatus(stato)),
    },
  };
};

/**
 * Converte una riga della tabella in una transazione.
 * @param {Object} row - Riga della tabella da convertire.
 * @returns {Transazione} Oggetto transazione.
 */
const mapFromRow = (row) => {
  const transazioneParams = {
    nome: row.id.nome,
    tipo: row.id.tipo,
    importoDovuto: row.importoDovuto.value,
    importoCorrisposto: row.importoCorrisposto.value,
    stato: row.stato.value,
  };
  return new Transazione(transazioneParams);
};

/**
 * Genera un identificatore unico per la transazione.
 * @param {Transazione} transazione - Oggetto transazione.
 * @returns {Object} Identificatore unico basato su nome e tipo.
 */
const getId = (transazione) => ({
  nome: transazione.nome,
});

/**
 * Mappa lo stato al prossimo valore e colore corrispondente.
 * @param {string} currentStato - Stato attuale della transazione.
 * @returns {Object} Il prossimo stato e colore.
 */
const getNextStatus = (currentStato) => {
  const nextStatusMap = {
    [Transazione.stati.SALDATO]: Transazione.stati.DA_SALDARE,
    [Transazione.stati.PARZIALMENTE_SALDATO]: Transazione.stati.SALDATO,
    [Transazione.stati.DA_SALDARE]: Transazione.stati.PARZIALMENTE_SALDATO,
  };

  return nextStatusMap[currentStato];
};

/**
 * Custom hook per gestire lo stato delle righe della tabella delle transazioni.
 * @param {Transazione[]} transazioni - Array di transazioni iniziali.
 * @returns {Object} Stato e metodi per gestire le righe.
 */
const useTransazioneTableRow = ({
  store,
  disabled,
  onChange,
  onBlur,
  errors,
}) => {

  const { updateItem, filterItems } = useArrayStore(store);
  
 
  // Funzione per mappare una transazione a una riga
  const mapRow = React.useCallback(
    ({transazione, index}) =>
      mapToRow({
        transazione,
        onChange: (key, value) => handleChange({key, value, index}),
        disabled: disabled.includes(nome => nome?.toUpperCase() === transazione.nome?.toUpperCase()),
        errors
      }),
    [disabled, errors]
  );

   // Recuperare i dati dalla store
  const filteredItems = filterItems(() => true);
  const data = React.useMemo(() => {
    return filteredItems.map((transazione, index) =>
      mapRow({transazione, index})
    );
  }, [filteredItems, mapRow]);

  // Gestione delle modifiche
  const handleChange = React.useCallback(
    ({key, value, index}) => {
      // Crea nuova istanza della transazione con i valori aggiornati per non violare l'immutabilità
      // const updatedTransazione = new Transazione({
      //   nome: transazione.nome,
      //   tipo: transazione.tipo,
      //   importoDovuto:
      //     key === 'importoDovuto' ? value : transazione.importoDovuto,
      //   importoCorrisposto:
      //     key === 'importoCorrisposto' ? value : transazione.importoCorrisposto,
      //   stato: key === 'stato' ? value : transazione.stato,
      // });
      console.log('key', key, 'value', value, 'index', index);
      updateItem(index, { [key]: value });
      //onChange?.(index, { [key]: value });
      //onBlur?.(index, { [modelKey]: updatedTransazione });
    },
    [updateItem]
  );

  return { data, handleChange };
};

export default useTransazioneTableRow;

export { useTransazioneTableRow };
