import { useMemo } from 'react';

/**
 * Hook per inizializzare le righe della tabella con un campo `id`.
 * Controlla che gli ID siano univoci e genera un ID se mancante.
 * @param {Array} columns - Configurazione delle colonne della tabella.
 * @param {Array} data - Dati iniziali della tabella.
 * @returns {Array} Righe della tabella con un campo `id` garantito.
 * @throws {Error} Se vengono rilevati ID duplicati.
 */
const useTableRows = (columns, data) => {
  const rows = useMemo(() => {
    // Mappa per tenere traccia degli ID già visti
    const idSet = new Set();

    // Prepara le righe con ID garantiti
    const processedRows = data.map((row, index) => {
      // Determina l'ID della riga
      const id = row.hasOwnProperty('id') ? row.id : index;

      // Controlla se l'ID è duplicato
      if (idSet.has(id)) {
        throw new Error(`Duplicate ID found: ${id}`);
      }
      idSet.add(id);

      // Restituisce la riga con l'ID garantito
      return {
        ...row,
        id,
      };
    });

    return processedRows;
  }, [columns, data]); // Aggiorna solo se cambiano columns o data

  return {rows};
};

export default useTableRows;
