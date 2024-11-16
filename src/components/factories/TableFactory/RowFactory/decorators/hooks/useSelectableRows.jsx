import React, { createContext, useContext, useState } from 'react';

// Crea il context
const SelectableContext = createContext();

export const SelectableProvider = ({ children, isMultiSelect = true, initialSelected = [] }) => {
  // Inizializza le righe selezionate in base alla modalità
  const [selectedRows, setSelectedRows] = useState(() => {
    if (isMultiSelect) {
      return initialSelected; // Multipla: tutte le righe iniziali
    } else {
      return initialSelected.length > 0 ? [initialSelected[0]] : []; // Esclusiva: solo la prima
    }
  });

  const toggleRowSelection = (row) => {
    setSelectedRows((prevSelected) => {
      if (isMultiSelect) {
        // Selezione multipla
        return prevSelected.includes(row.id)
          ? prevSelected.filter((id) => id !== row.id)
          : [...prevSelected, row.id];
      } else {
        // Selezione esclusiva
        return prevSelected.includes(row.id) ? [] : [row.id];
      }
    });
  };

  const isRowSelected = (row) => selectedRows.includes(row.id);

  return (
    <SelectableContext.Provider value={{ selectedRows, toggleRowSelection, isRowSelected }}>
      {children}
    </SelectableContext.Provider>
  );
};

export const useSelectableRows = () => {
  const context = useContext(SelectableContext);
  if (!context) {
    throw new Error('useSelectableRows must be used within a SelectableProvider');
  }
  return context;
};
