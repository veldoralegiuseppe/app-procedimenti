import React from 'react';
import { TableCell, Checkbox } from '@mui/material';
import { useSelectableRows } from './hooks/useSelectableRows'; // Importa il hook

const SelectableDecorator = (WrappedRow) => ({ row, columns, children, ...props }) => {
  const { toggleRowSelection, isRowSelected } = useSelectableRows();

  const handleSelect = useMemo(() => (e) => {
    e.stopPropagation(); // Blocca la propagazione per evitare conflitti con onRowClick
    toggleRowSelection(row);
  }, [row, toggleRowSelection]);

  return (
    <WrappedRow {...props} row={row} columns={columns}>
      {/* Renderizza la checkbox come TableCell */}
      <TableCell data-type="selectable" style={{ width: '50px' }} padding="checkbox">
        <Checkbox
          checked={isRowSelected(row)}
          onChange={handleSelect}
          onClick={(e) => e.stopPropagation()} // Assicurati che onRowClick non venga attivato
        />
      </TableCell>

      {/* Passa i children originali */}
      {children}
    </WrappedRow>
  );
};

// Aggiungi un displayName per identificare il decoratore
SelectableDecorator.displayName = 'SelectableDecorator';

export default SelectableDecorator;
