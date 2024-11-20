import React from 'react';
import ImportoReadOnly from '@components/ImportoReadOnly';
import ImportoInput from '@components/ImportoInput';
import { statoChipFlagMap, Transazione } from '@model/transazione';
import _ from 'lodash';

/**
 * Mappa una transazione in una riga della tabella.
 * @param {Transazione} transazione - Oggetto transazione da mappare.
 * @param {Function} handleChange - Callback per gestire le modifiche.
 * @returns {Object} Rappresentazione della riga.
 */
const mapToRow = (transazione, handleChange, disabled) => {
  const isParzialmenteSaldato =
    transazione.stato === Transazione.stati.PARZIALMENTE_SALDATO;

  return {
    id: getId(transazione),

    importoDovuto: {
      component: disabled ? ImportoReadOnly : ImportoInput,
      value: transazione.importoDovuto || 0,
      sx: { width: '12rem' },
      backgroundColor: !disabled ? 'transparent' : '#cacaca29',
      onChange: disabled
        ? () => {}
        : (value) => handleChange('importoDovuto', value),
    },

    importoCorrisposto: {
      component: disabled
        ? ImportoReadOnly
        : isParzialmenteSaldato
        ? ImportoInput
        : ImportoReadOnly,
      value: transazione.importoCorrisposto || 0,
      sx: { width: '12rem' },
      backgroundColor: isParzialmenteSaldato ? 'transparent' : '#cacaca29',
      onChange: disabled
        ? () => {}
        : (value) => handleChange('importoCorrisposto', value),
    },

    stato: {
      value: transazione.stato,
      status: statoChipFlagMap[transazione.stato],
      onClick: disabled
        ? () => {}
        : () => handleChange('stato', getNextStatus(transazione.stato)),
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
  tipo: transazione.tipo,
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
const useTransazioneTableRow = (transazioni, rowConfig = {}) => {
  const { disabled = [] } = rowConfig;

  // Pre-elaborare i nomi disabilitati (normalizzati per confronto case-insensitive)
  const disabledTransactions = React.useMemo(
    () => disabled.map((nome) => nome?.toUpperCase()),
    [disabled]
  );

  // Funzione per mappare una transazione a una riga
  const mapRow = React.useCallback(
    (transazione, disabledNames) =>
      mapToRow(
        transazione,
        (key, value) => handleChange(transazione, key, value),
        disabledNames.includes(transazione.nome?.toUpperCase())
      ),
    []
  );

  // Inizializza i dati della tabella
  const [data, setData] = React.useState(() =>
    (transazioni || []).map((transazione) =>
      mapRow(transazione, disabledTransactions)
    )
  );

  // Gestione delle modifiche
  const handleChange = React.useCallback((transazione, key, value) => {
    setData((prevData) =>
      prevData.map((row) => {
        if (!_.isEqual(getId(transazione), row.id)) return row;

        // Crea una nuova transazione aggiornata
        const updatedTransazione = new Transazione({
          ...transazione,
          [key]: value,
        });

        return mapRow(updatedTransazione, disabledTransactions);
      })
    );
  }, [disabledTransactions]);

  return { data, setData };
};

export { useTransazioneTableRow };
