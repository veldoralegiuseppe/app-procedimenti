import React from 'react';
import { TableRow } from '@mui/material';
import CellFactory from '../CellFactory/CellFactory';
import _ from 'lodash';

const BaseRow = ({ id, row, columns, onRowClick, children, sx, components={}, store }) => {
  
  // Trova il SelectableDecorator basato su data-type
  const selectableChild = React.Children.toArray(children).find(
    (child) => child.props?.['data-type'] === 'selectable'
  );

  // Trova gli altri children
  const otherChildren = React.Children.toArray(children).filter(
    (child) => child.props?.['data-type'] !== 'selectable'
  );

  const TableRowComponent = components.TableRow || TableRow;

  return (
    <TableRowComponent
      sx={{...sx }}
      onClick={(e) => {
        if (onRowClick) onRowClick(row);
      }}
      style={{ cursor: onRowClick ? 'pointer' : 'default' }}
    >
      {/* Renderizza il SelectableDecorator per primo */}
      {selectableChild}

      {/* Renderizza le celle normali */}
      {columns.map((column, index) => (
        <CellFactory key={`row-${id}-cell-${index}`} column={column} rowId={id} row={row} store={store} />
      ))}

      {/* Renderizza gli altri children */}
      {otherChildren}
    </TableRowComponent>
  );
};

export default BaseRow;
