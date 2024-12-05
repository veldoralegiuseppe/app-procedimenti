import React from 'react';
import { TableCell } from '@mui/material';
import ChipCell from './components/ChipCell/ChipCell';
import InputCell from './components/InputCell';
import _ from 'lodash';

const CellFactory = ({ column, row, sx, store }) => {
  
  const cellParams = row[column.field] ? {id:row.id, ...row[column.field]} : {id: row.id};
  const cellType = column.type || 'text';
  const selector = () => {
    const { methodName, params } = cellParams?.selectorMeta || {};
    return store?.getState()?.[methodName]?.(...Object.values(params));
  };
  
  // Rendering condizionale basato sul tipo di cella
  const renderCellContent = () => {
    switch (cellType) {
      case 'chip':
        return <ChipCell {...cellParams} columnField={column.field} store={store} />;
      case 'input':
        return <InputCell {...cellParams} selector={selector} columnField={column.field} store={store}/>;
      case 'custom':
        return column.render ? column.render({...cellParams, rowId: cellParams.id, store, column}) : cellParams; 
      case 'text':
      default:
        return cellParams; // Contenuto testuale predefinito
    }
  };

  return (
    <TableCell sx={{ ...sx }} align={column.align || 'left'}>
      {renderCellContent()}
    </TableCell>
  );
};

export default CellFactory;
