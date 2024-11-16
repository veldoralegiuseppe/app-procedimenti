import React from 'react';
import { TableCell, Chip, TextField } from '@mui/material';

const CellFactory = ({ column, row, sx }) => {
  const cellData = row[column.field];
  const cellType = column.type || 'text'; // Tipo predefinito è 'text'

  // Rendering condizionale basato sul tipo di cella
  const renderCellContent = () => {
    switch (cellType) {
      case 'chip':
        return <Chip label={cellData} />;
      case 'input':
        return (
          <TextField
            value={cellData}
            onChange={(e) =>
              column.onChange && column.onChange(e.target.value, row)
            }
            size="small"
            variant="outlined"
          />
        );
      case 'custom':
        return column.render ? column.render(cellData, row) : cellData; // Usa il render personalizzato
      case 'text':
      default:
        return cellData; // Contenuto testuale predefinito
    }
  };

  return (
    <TableCell sx={{ ...sx }} align={column.align || 'left'}>
      {renderCellContent()}
    </TableCell>
  );
};

export default CellFactory;
