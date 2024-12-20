import { useMemo, useEffect } from 'react';
import { useCreateStore, useModelArray } from '@ui-shared/hooks';

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
    console.log('newRows', data);
    const idSet = new Set();
    const processedRows = data.map((row, index) => {
      const id = row.hasOwnProperty('id') ? row.id : index;
      if (idSet.has(id)) {
        throw new Error(`Duplicate ID found: ${id}`);
      }

      idSet.add(id);

      return {
        ...row,
        id,
      };
    });

    return processedRows;
  }, [data, columns]);

  const tableStore = useCreateStore({ storeInterface: useModelArray, initialItems: rows });

  useEffect(() => {
    console.log('allineo tablerows', rows);
    tableStore.getState().resetItems(rows)
    console.log('new store', tableStore.getState().getItems())
  }, [rows, tableStore]);

  return { tableStore, rows };
};

export default useTableRows;
