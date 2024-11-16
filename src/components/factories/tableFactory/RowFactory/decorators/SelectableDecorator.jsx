import React from 'react';
import { TableCell, Checkbox } from '@mui/material';

const SelectableDecorator = (WrappedRow) => ({ selectableConfig, row, columns, children, ...props }) => {
  const { onSelect, isSelected } = selectableConfig;

  const handleSelect = (e) => {
    e.stopPropagation();
    onSelect && onSelect(row);
  };

  return (
    <WrappedRow {...props} row={row} columns={columns}>
      {React.Children.toArray(children)}
      <TableCell style={{ width: '50px' }} padding="checkbox">
        <Checkbox
          checked={isSelected ? isSelected(row) : false}
          onChange={handleSelect}
        />
      </TableCell>
    </WrappedRow>
  );
};

export default SelectableDecorator;
