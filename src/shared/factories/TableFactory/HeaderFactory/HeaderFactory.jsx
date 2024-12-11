import React from 'react';
import { TableRow, TableCell } from '@mui/material';
import TooltipDecorator from './decorators/TooltipDecorator';
import SortableDecorator from './decorators/SortableDecorator';
import _ from 'lodash';

const HeaderFactoryComponent = ({
  columns,
  onSort,
  collapsibleConfig,
  selectableConfig,
  components = {},
  sx,
  order,
  orderBy,
}) => {
  // Recupera i componenti sovrascrivibili o utilizza quelli di default
  const TableHeadComponent = React.useMemo(() => components.TableHead || 'thead', [components.TableHead]);
  const TableRowComponent = React.useMemo(() => components.TableRow || TableRow, [components.TableRow]);
  const TableCellComponent = React.useMemo(() => components.TableCell || TableCell, [components.TableCell]);

  const handleSort = React.useCallback((column) => {
    const isAsc = orderBy === column.field && order === 'asc';
    const newOrder = isAsc ? 'desc' : 'asc';
    onSort && onSort(column.field, newOrder);
  }, [order, orderBy, onSort]);

  return (
    <TableHeadComponent sx={{ ...sx }}>
      <TableRowComponent>
        {selectableConfig && Object.keys(selectableConfig).length > 0 && <TableCellComponent sx={{ width: '2.5rem' }} />}

        {columns.map((column) => {
          // Applica i decoratori condizionalmente
            const HeaderContent = React.useMemo(() => {
            let Component = (props) => <div style={{...props.sx}}>{props.children}</div>; 

            if (column.tooltip) {
              Component = TooltipDecorator(Component);
            }

            if (column.sortable) {
              Component = SortableDecorator(Component);
            }

            return Component;
            }, [column.tooltip, column.sortable]);

          return (
            <TableCellComponent sx={column.sx} key={column.field} align={column.align || 'left'}>
              <HeaderContent
                tooltip={column.tooltip}
                sortable={column.sortable}
                active={orderBy === column.field}
                direction={orderBy === column.field ? order : 'asc'}
                onSort={() => handleSort(column)}
                sx={{ fontSize: '.9rem' }}
              >
                {column.headerName}
              </HeaderContent>
            </TableCellComponent>
          );
        })}

        {collapsibleConfig && Object.keys(collapsibleConfig).length > 0 && <TableCellComponent sx={{ width: '2.5rem' }} />}
      </TableRowComponent>
    </TableHeadComponent>
  );
};

const HeaderFactory = React.memo(HeaderFactoryComponent, (prevProps, nextProps) => {
  return (
    _.isEqual(prevProps.order, nextProps.order) &&
    _.isEqual(prevProps.orderBy, nextProps.orderBy) &&
    _.isEqual(prevProps.onSort, nextProps.onSort) &&
    _.isEqual(prevProps.sx, nextProps.sx)
  );
});

export default HeaderFactory;
