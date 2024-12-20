import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';

// Crea il context
const SelectableContext = createContext();

export const SelectableProvider = ({
  children,
  isMultiSelect = true,
  initialSelected = [],
  tableStore,
  onSelected = () => {}, // Callback invocata al cambio di selezione
}) => {
  
  const itemsLength = tableStore(state => state.items.length);

  useEffect(() => {
    if (itemsLength === 0) {
      setSelectedRows([]);
    }
  }, [itemsLength]);

  // Inizializza le righe selezionate in base alla modalità
  const [selectedRows, setSelectedRows] = useState(() => {
    if (isMultiSelect) {
      return initialSelected; // Multipla: tutte le righe iniziali
    } else {
      return initialSelected.length > 0 ? [initialSelected[0]] : []; // Esclusiva: solo la prima
    }
  });

  const toggleRowSelection = useMemo(() => (row) => {
    setSelectedRows((prevSelected) => {
      let updatedSelection;
      if (isMultiSelect) {
        // Selezione multipla
        updatedSelection = prevSelected.includes(row.id)
          ? prevSelected.filter((id) => id !== row.id)
          : [...prevSelected, row.id];
      } else {
        // Selezione esclusiva
        updatedSelection = prevSelected.includes(row.id) ? [] : [row.id];
      }

      // Invoca la callback con la selezione aggiornata
      onSelected(updatedSelection);
      return updatedSelection;
    });
  }, [isMultiSelect, onSelected]);

  const isRowSelected = useMemo(() => (row) => selectedRows.includes(row.id), [selectedRows]);

  return (
    <SelectableContext.Provider
      value={{ selectedRows, toggleRowSelection, isRowSelected, setSelectedRows }}
    >
      {children}
    </SelectableContext.Provider>
  );
};

export const useSelectableRows = () => {
  const context = useContext(SelectableContext);
  if (!context) {
    throw new Error(
      'useSelectableRows must be used within a SelectableProvider'
    );
  }
  return useMemo(() => context, [context]);
};
