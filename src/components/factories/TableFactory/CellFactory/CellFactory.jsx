import React from 'react';
import { TableCell, TextField } from '@mui/material';
import ChipCell from './components/ChipCell';
import InputCell from './components/InputCell';
import InfoChipCell from './components/InfoChipCell';

const CellFactory = ({ column, row, sx }) => {
  const cellData = row[column.field];
  const cellType = column.type || 'text';

  // Rendering condizionale basato sul tipo di cella
  const renderCellContent = () => {
    switch (cellType) {
      case 'chip':
        return <ChipCell {...cellData} row={row} />;
      case 'infoChip':
        return <InfoChipCell {...cellData} row={row}/>;
      case 'input':
        return <InputCell {...cellData} />;
      case 'custom':
        return column.render ? column.render(cellData, row) : cellData; 
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
