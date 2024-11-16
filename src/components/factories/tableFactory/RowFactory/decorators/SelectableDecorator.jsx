import React from 'react';
import { TableCell, Checkbox } from '@mui/material';
import {useSelectableRows} from './hooks/useSelectableRows'; // Importa il hook

const SelectableDecorator = (WrappedRow) => ({ row, columns, children, ...props }) => {
  const { toggleRowSelection, isRowSelected } = useSelectableRows(); 

  const handleSelect = (e) => {
    e.stopPropagation();
    toggleRowSelection(row); 
  };

  return (
    <WrappedRow {...props} row={row} columns={columns}>
      {React.Children.toArray(children)}
      <TableCell style={{ width: '50px' }} padding="checkbox">
        <Checkbox
          checked={isRowSelected(row)} 
          onChange={handleSelect} 
          onClick={(e) => e.stopPropagation()}
        />
      </TableCell>
    </WrappedRow>
  );
};

export default SelectableDecorator;
