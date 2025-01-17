import React from 'react';
import { TableCell } from '@mui/material';
import ChipCell from './components/ChipCell/ChipCell';
import InputCell from './components/InputCell';
import _ from 'lodash';

const CellFactory = ({ column, row, sx, store }) => {
  
  const cellParams = row[column.field] ? {id:row.id, ...row[column.field]} : {id: row.id};
  const cellType = column.type || 'text';

  // Rendering condizionale basato sul tipo di cella
  const renderCellContent = () => {
    switch (cellType) {
      case 'chip':
        return <ChipCell {...cellParams} columnField={column.field}/>;
      case 'input':
        return <InputCell {...cellParams} columnField={column.field}/>;
      case 'custom':
        return column.render ? column.render({...cellParams, rowId: cellParams.id, store, column}) : cellParams; 
      case 'text':
      default:
        return row[column.field]; // Contenuto testuale predefinito
    }
  };

  return (
    <TableCell sx={{ ...sx }} align={column.align || 'left'}>
      {renderCellContent()}
    </TableCell>
  );
};

export default CellFactory;
