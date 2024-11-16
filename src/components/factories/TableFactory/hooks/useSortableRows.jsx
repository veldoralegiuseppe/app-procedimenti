import { useState } from 'react';

/**
 * Hook per gestire l'ordinamento delle righe in base alla colonna.
 * @param {Array} initialRows - L'array iniziale delle righe.
 */
const useSortableRows = (initialRows = []) => {
  const [rows, setRows] = useState(initialRows);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState(null);

  /**
   * Funzione per gestire l'ordinamento.
   * @param {string} columnField - Il campo della colonna da ordinare.
   */
  const handleSort = (columnField) => {
    const isAsc = orderBy === columnField && order === 'asc';
    const newOrder = isAsc ? 'desc' : 'asc';

    setOrder(newOrder);
    setOrderBy(columnField);

    const sortedRows = [...rows].sort((a, b) => {
      if (a[columnField] < b[columnField]) {
        return newOrder === 'asc' ? -1 : 1;
      }
      if (a[columnField] > b[columnField]) {
        return newOrder === 'asc' ? 1 : -1;
      }
      return 0;
    });

    setRows(sortedRows);
  };

  return {
    rows, // Righe ordinate
    order, // Direzione dell'ordinamento
    orderBy, // Colonna ordinata
    handleSort, // Funzione per aggiornare l'ordinamento
  };
};

export default useSortableRows;
