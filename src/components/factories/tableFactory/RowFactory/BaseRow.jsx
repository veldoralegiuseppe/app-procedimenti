import React from 'react';
import { TableRow } from '@mui/material';
import CellFactory from '../CellFactory/CellFactory';

const BaseRow = ({ row, columns, onRowClick, children, sx }) => {
  // Trova il SelectableDecorator basato su data-type
  const selectableChild = React.Children.toArray(children).find(
    (child) => child.props?.['data-type'] === 'selectable'
  );

  // Trova gli altri children
  const otherChildren = React.Children.toArray(children).filter(
    (child) => child.props?.['data-type'] !== 'selectable'
  );

  return (
    <TableRow
      sx={{ ...sx }}
      onClick={(e) => {
        if (onRowClick) onRowClick(row);
      }}
      style={{ cursor: onRowClick ? 'pointer' : 'default' }}
    >
      {/* Renderizza il SelectableDecorator per primo */}
      {selectableChild}

      {/* Renderizza le celle normali */}
      {columns.map((column) => (
        <CellFactory key={column.field} column={column} row={row} />
      ))}

      {/* Renderizza gli altri children */}
      {otherChildren}
    </TableRow>
  );
};

export default BaseRow;
