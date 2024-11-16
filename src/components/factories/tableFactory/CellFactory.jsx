import React from 'react';
import { TableCell } from '@mui/material';

const CellFactory = ({ column, row, sx }) => {
  const cellData = row[column.field];
  return (
    <TableCell sx={{...sx}} align={column.align || 'left'}>
      {column.render ? column.render(cellData, row) : cellData}
    </TableCell>
  );
};

export default CellFactory;
