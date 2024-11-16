import React, { useState } from 'react';
import { TableRow, TableCell, TableSortLabel } from '@mui/material';

const HeaderFactory = ({
  columns,
  onSort,
  collapsibleConfig,
  selectableConfig,
  components = {},
  sx,
}) => {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState(null);

  // Recupera i componenti sovrascrivibili o utilizza quelli di default
  const TableHeadComponent = components.TableHead || 'thead';
  const TableRowComponent = components.TableRow || TableRow;
  const TableCellComponent = components.TableCell || TableCell;

  const handleSort = (column) => {
    const isAsc = orderBy === column.field && order === 'asc';
    const newOrder = isAsc ? 'desc' : 'asc';
    setOrder(newOrder);
    setOrderBy(column.field);
    onSort && onSort(column.field, newOrder);
  };

  return (
    <TableHeadComponent sx={{ ...sx }}>
      <TableRowComponent>
        {selectableConfig && <TableCellComponent sx={{width: '4.5rem'}}/>}
        {collapsibleConfig && <TableCellComponent sx={{width: '4.5rem'}}/>}
        {columns.map((column) => (
          <TableCellComponent key={column.field} align={column.align || 'left'}>
            {column.sortable ? (
              <TableSortLabel
                active={orderBy === column.field}
                direction={orderBy === column.field ? order : 'asc'}
                onClick={() => handleSort(column)}
              >
                {column.headerName}
              </TableSortLabel>
            ) : (
              column.headerName
            )}
          </TableCellComponent>
        ))}
      </TableRowComponent>
    </TableHeadComponent>
  );
};

export default HeaderFactory;
