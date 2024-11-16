import React from 'react';
import { TableRow } from '@mui/material';
import CellFactory from '../CellFactory';

const BaseRow = ({ row, columns, onRowClick, children, sx }) => {
  return (
    <TableRow
      sx={{ ...sx }}
      onClick={(e) => {
        if (onRowClick) onRowClick(row);
      }}
      style={{ cursor: onRowClick ? 'pointer' : 'default' }}
    >
      {/* Renderizza i figli (come checkbox o icone) */}
      {children}

      {/* Renderizza le celle normali */}
      {columns.map((column) => (
        <CellFactory key={column.field} column={column} row={row} />
      ))}
    </TableRow>
  );
};

export default BaseRow;
