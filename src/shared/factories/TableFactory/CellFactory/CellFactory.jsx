import React from 'react';
import { TableCell } from '@mui/material';
import ChipCell from './components/ChipCell/ChipCell';
import InputCell from './components/InputCell';
import InfoChipCell from './components/ChipCell/InfoChipCell';
import _ from 'lodash';

const CellFactory = ({ column, row, sx, store }) => {
  
  const cellData = row[column.field] ? {id:row.id, ...row[column.field]} : {id: row.id};
  const cellType = column.type || 'text';
  //console.log('cellData', cellData, 'row', row, 'column', column, 'cellType', cellType);


  // Rendering condizionale basato sul tipo di cella
  const renderCellContent = () => {
    switch (cellType) {
      case 'chip':
        return <ChipCell {...cellData} columnField={column.field} store={store} />;
      case 'infoChip':
        return <InfoChipCell {...cellData} columnField={column.field} store={store}/>;
      case 'input':
        return <InputCell {...cellData} columnField={column.field} store={store}/>;
      case 'custom':
        return column.render ? column.render({...cellData, rowId: cellData.id, store, column}) : cellData; 
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
